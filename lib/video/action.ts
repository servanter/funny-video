import prisma from "@/lib/prisma";

export async function getMonthStatistics(userId: string) {
  // 获取当前日期
  const currentDate = new Date();

  // 计算最近6个月的开始和结束日期
  const monthsData = [];

  for (let i = 5; i >= 0; i--) {
    // 计算月份的开始和结束
    const targetMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const nextMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 1);

    // 查询该月份的视频数量
    const videoCount = await prisma.video.count({
      where: {
        create_time: {
          lt: nextMonth
        },
        user_id: userId
      }
    });

    // 格式化月份名称 (如：2025.1)
    const monthName = `${targetMonth.getFullYear()}.${targetMonth.getMonth() + 1}`;

    monthsData.push({
      name: monthName,
      Videos: videoCount
    });
  }

  return monthsData;
}


export async function getTotalCount(userId: string) {
  const totalCount = await prisma.video.count({
    where: {
      user_id: userId
    }
  });

  return totalCount || 0
}

export async function getLastMonthTotalCount(userId: string) {
  // 获取当前日期
  const currentDate = new Date();
  const targetMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastMonthCount = await prisma.video.count({
    where: {
      create_time: {
        lt: targetMonth,
      },
      user_id: userId
    }
  });

  return lastMonthCount || 0
}