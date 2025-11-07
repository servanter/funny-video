import { getCurrentUser } from '@/lib/session';
import { getUserUsage } from "@/lib/user/action";
import { getLastMonthTotalCount, getMonthStatistics, getTotalCount } from '@/lib/video/action';
import { UserInfo } from '@/types/user';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userInfo = (await getCurrentUser()) as UserInfo;  // 从session获取当前用户信息

    const userData = await getUserUsage(userInfo.userId);
    const monthData = await getMonthStatistics(userInfo.userId);// 统计信息
    const totalCount = await getTotalCount(userInfo.userId);    // 总数
    const lastMonthCount = await getLastMonthTotalCount(userInfo.userId)  // 截止上月总数

    // 返回格式化的数据
    return NextResponse.json({
      monthsData: monthData,
      totalCount,
      afterMonthCount: totalCount - lastMonthCount,
      update_time: userData.user?.updatedAt,
      user: userData
    });

  } catch (error) {
    console.error('Error fetching video statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video statistics' },
      { status: 500 }
    );
  }
}