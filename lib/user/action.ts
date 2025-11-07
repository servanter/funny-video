import { getBoostPackKey, getUserDateUsageKey, MEMBERSHIP_ROLE_VALUE, ROLES_LIMIT } from "@/lib/constants";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";

export async function getUserUsage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { userId },
  });

  if (!user) throw new Error("User not found");

  const membershipExpire = (user.currentPeriodEnd || 0) * 1000

  // Check if user is on a pro plan.
  const isMembership =
    membershipExpire > Date.now().valueOf();

  const usage = await getUsageFromRedis(userId)

  // 加油包默认-1
  let membershipTodayRemaing = -1;
  if (isMembership) {
    membershipTodayRemaing = Math.max(ROLES_LIMIT[2] - usage.membershipTodayUsage, 0);
  }

  const result = {
    membershipExpire: isMembership ? membershipExpire : 0,
    role: isMembership ? MEMBERSHIP_ROLE_VALUE : 0, // 2包月 : 0普通
    membershipTodayRemaing: membershipTodayRemaing, // 包月剩余次数
    boostPackRemaining: usage.boostPackRemaining, // 加油包剩余次数
    user: user
  }

  return result
}


/**
 * 获取用户的订阅状态信息
 * @param {string} params.userId - 用户ID
 * @returns {Promise<{membershipTodayUsage: number, boostPackRemaining: number}>} 包含今日使用量和剩余加速包数量的对象
 */
async function getUsageFromRedis(userId: string): Promise<{ membershipTodayUsage: number, boostPackRemaining: number }> {
  const pipeline = redis.pipeline();
  const keyDate = getUserDateUsageKey({ userId });
  pipeline.get(keyDate);
  const boostPackKey = getBoostPackKey({ userId });
  pipeline.get(boostPackKey);

  const pipelineResults = await pipeline.exec();
  const userTodayUsageStr = pipelineResults[0] as string;
  const boostPackRemainingStr = pipelineResults[1] as string;

  const membershipTodayUsage = parseInt(userTodayUsageStr ?? '0');
  const boostPackRemaining = parseInt(boostPackRemainingStr ?? '0');

  return { membershipTodayUsage, boostPackRemaining };
}