import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 视频查询API
 * GET /api/videos?user_id=xxx
 * 根据user_id查询视频列表，按update_time倒序排序
 */
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    // 验证必填参数
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: '参数错误：user_id为必填参数',
          code: 400,
        },
        { status: 400 }
      );
    }

    // 查询视频列表
    const videos = await prisma.video.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        update_time: 'desc', // 按update_time倒序排序
      }
    });

    console.log('查询到的视频列表:', videos);

    // 格式化时间字段
    const formattedVideos = videos.map(video => ({
      ...video,
      create_time: video.create_time.toISOString(),
      update_time: video.update_time.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        videos: formattedVideos,
        total: formattedVideos.length,
      },
      message: '查询成功',
      code: 200,
    });

  } catch (error) {
    console.error('视频查询API错误:', error);

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