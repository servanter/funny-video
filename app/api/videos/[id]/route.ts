import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { getTokenUrl } from '@/lib/supabase/storage';
import { UserInfo } from '@/types/user';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 视频详情查询API
 * GET /api/videos/[id]?user_id=xxx
 * 根据视频ID和用户ID查询视频详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取查询参数
    const userInfo = (await getCurrentUser() as UserInfo);
    const videoId = params.id;

    // 验证必填参数
    if (!userInfo?.userId || !videoId) {
      return NextResponse.json(
        {
          success: false,
          message: '参数错误：user_id和视频ID为必填参数',
          code: 400,
        },
        { status: 400 }
      );
    }


    // 查询视频详情
    const video = await prisma.video.findFirst({
      where: {
        id: parseInt(videoId, 0),
        user_id: userInfo?.userId,
      },
    });


    if (!video) {
      return NextResponse.json(
        {
          success: false,
          message: '视频不存在或无访问权限',
          code: 404,
        },
        { status: 404 }
      );
    }

    console.log('查询到的视频详情:', video);

    // 获取视频的签名URL
    const signedVideoUrl = await getTokenUrl(userInfo?.userId + video.result_video_url);

    // 格式化时间字段
    const formattedVideo = {
      ...video,
      result_video_url: signedVideoUrl || '',
      create_time: video.create_time.toISOString(),
      update_time: video.update_time.toISOString(),
    };


    console.log('查询到的视频详情:', formattedVideo);

    return NextResponse.json({
      success: true,
      data: {
        video: formattedVideo,
      },
      message: '查询成功',
      code: 200,
    });

  } catch (error) {
    console.error('视频详情查询API错误:', error);

    return NextResponse.json(
      {
        success: false,
        message: '服务器内部错误',
        code: 500,
      },
      { status: 500 }
    );
  }
}

/**
 * 处理OPTIONS请求（CORS预检）
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}