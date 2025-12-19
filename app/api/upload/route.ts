import { getCurrentUser } from "@/lib/session";
import { getTokenUrl } from "@/lib/supabase/storage";
import { decrementBoostPack, getUserUsage, incrMembershipUsage } from "@/lib/user/action";
import { UserInfo } from "@/types/user";
import { IncomingForm } from 'formidable';
import fsPromises from 'fs/promises';
import { IncomingMessage } from 'http';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const user = (await getCurrentUser()) as UserInfo;
  const form = new IncomingForm();
  console.log(user, 'starting file upload');

  try {
    // Create proper stream for formidable
    const chunks: Uint8Array[] = [];
    const reader = request.body?.getReader();

    if (!reader) {
      throw new Error('No request body found');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const bodyBuffer = Buffer.concat(chunks);

    let paused = false;
    const mockIncomingMessage = {
      headers: Object.fromEntries(request.headers.entries()),
      pause: () => { paused = true; },
      resume: () => { paused = false; },
      on: (event: string, listener: (...args: any[]) => void) => {
        if (event === 'data' && !paused) {
          listener(bodyBuffer);
        } else if (event === 'end') {
          listener();
        }
        return mockIncomingMessage;
      },
      socket: {},
      connection: {},
      httpVersion: '1.1',
      httpVersionMajor: 1,
      httpVersionMinor: 1
    } as unknown as IncomingMessage;

    const formData = await new Promise<{ files: any, fields: any }>((resolve, reject) => {
      form.parse(mockIncomingMessage, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ files, fields });
      });
    });

    const file = Array.isArray(formData.files.file) ? formData.files.file[0] : formData.files.file;
    if (!file) {
      throw new Error('No file found in form data');
    }

    // 获取选中的时刻
    let selectedMoments: string[] = []; // 默认值
    if (formData.fields.selectedMoments) {
      try {
        const momentsValue = Array.isArray(formData.fields.selectedMoments)
          ? formData.fields.selectedMoments[0]
          : formData.fields.selectedMoments;
        selectedMoments = JSON.parse(momentsValue);
        console.log('Selected moments:', selectedMoments);
      } catch (error) {
        console.error('Error parsing selectedMoments:', error);
      }
    }

    // 检查文件是否存在
    try {
      await fsPromises.access(file.filepath);
    } catch (error) {
      console.error('File not accessible:', error);
      throw new Error(`Temporary file not found: ${file.filepath}`);
    }

    // 读取文件内容到Buffer
    const fileBuffer = await fsPromises.readFile(file.filepath);

    // 创建原生 FormData
    const externalFormData = new FormData();
    const uint8Array = new Uint8Array(fileBuffer);
    const blob = new Blob([uint8Array], { type: file.mimetype || 'video/mp4' });
    externalFormData.append('file', blob, file.originalFilename);

    // 添加查询参数
    const params = new URLSearchParams({
      user_id: user.userId,
      title: file.originalFilename || 'unknown',
      description: `file:${file.originalFilename || 'unknown'}`,
      selected_moments: selectedMoments.join(',')
    });

    console.log('Sending request to external API with params:', params.toString());

    // 调用外网 API
    const response = await fetch(`http://115.190.35.59/file/upload?${params}`, {
      method: 'POST',
      body: externalFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      throw new Error(`External API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('External API response:', result);

    // 获取 result_video_url
    const resultVideoUrl = result.result?.result_video_url;

    if (!resultVideoUrl) {
      throw new Error('No result_video_url in external API response');
    }

    // 清理临时文件
    try {
      await fsPromises.unlink(file.filepath);
    } catch (error) {
      console.warn('Failed to cleanup temp file:', error);
    }


    const totalConsumption = selectedMoments.length * 10;
    //  区分用户状态
    const userUsage = await getUserUsage(user.userId);
    if (userUsage.role === 2) {
      if (userUsage.membershipTodayRemaing >= totalConsumption) {
        await incrMembershipUsage(user.userId, totalConsumption);
      } else {

        if (userUsage.boostPackRemaining >= totalConsumption) {
          await decrementBoostPack(user.userId, totalConsumption);
        } else {
          // 余额不足
          return NextResponse.json({
            message: 'Not enough credit',
            code: -1
          });
        }
      }
    } else {
      if (userUsage.boostPackRemaining >= totalConsumption) {
        await decrementBoostPack(user.userId, totalConsumption);
      } else {
        return NextResponse.json({
          message: 'Not enough credit',
          code: -1
        });
      }
    }

    console.log("resultVideoUrl", resultVideoUrl)
    const tokenUrl = await getTokenUrl(resultVideoUrl);
    console.log("tokenUrl", tokenUrl)

    const usage = await getUserUsage(user.userId)
    return NextResponse.json({
      message: 'success',
      code: 0,
      size: file.size,
      resultVideoUrl: tokenUrl,
      membershipTodayRemaing: usage.membershipTodayRemaing,
      boostPackRemaining: usage.boostPackRemaining
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}


