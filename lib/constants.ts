/**
 * 0 普通用户; 2 会员
 * Role values: 0 for Basic User; 2 for Member
 */

import { Role, UserId } from "@/types/user";

// Definitions for user roles.
export const ROLES: { [key in Role]: string } = {
  0: 'Basic',
  2: 'MemberShip',
}

// Daily usage limits for different roles.
export const ROLES_LIMIT: { [key in Role]: number } = {
  0: process.env.NEXT_PUBLIC_COMMON_USER_DAILY_LIMIT_STR && Number(process.env.NEXT_PUBLIC_COMMON_USER_DAILY_LIMIT_STR) || 10,
  2: process.env.NEXT_PUBLIC_MEMBERSHIP_DAILY_LIMIT_STR && Number(process.env.NEXT_PUBLIC_MEMBERSHIP_DAILY_LIMIT_STR) || 500,
}


export const ONE_DAY = 3600 * 24
export const DATE_USAGE_KEY_EXPIRE = 3600 * 24 * 10 // 10天，用户日用量保存时长 10 days, duration for saving daily user usage data
export const MEMBERSHIP_ROLE_VALUE = 2 // 月度会员的值 The value for monthly membership
export const BOOST_PACK_EXPIRE = ONE_DAY * Number(process.env.NEXT_PUBLIC_BOOST_PACK_EXPIRE_DAYS || 7) // 7天，购买加油包的使用期限 7 days, usage duration for a purchased boost pack
export const BOOST_PACK_CREDITS = Number(process.env.NEXT_PUBLIC_BOOST_PACK_CREDITS || 100) // 每次购买加油包获得的次数  Number of uses received per boost pack purchase


/**
 * 生成用户使用记录的键名
 * @param {UserId} userId - 用户ID对象，包含userId属性
 * @returns {string} 格式化的键名字符串，包含用户ID和当前日期
 */
export const getUserDateUsageKey = ({ userId }: UserId) => {
  const currentDate = new Date().toLocaleDateString();
  return `FUNNY::uid:${userId}::date:${currentDate}::user_date_usage`
}

/**
 * 生成用户积分缓存键
 * @param {UserId} userId - 用户ID对象，包含userId属性
 * @returns {string} 格式化的缓存键字符串，格式为"FUNNY::uid:{userId}::boost_pack_balance"
 */
export const getBoostPackKey = ({ userId }: UserId) => {
  return `FUNNY::uid:${userId}::boost_pack_balance`
}

/**
 * 生成用户积分缓存键
 * @param {UserId} userId - 用户ID对象，包含userId属性
 * @returns {string} 格式化的缓存键字符串，格式为"FUNNY::uid:{userId}::boost_pack_balance"
*/
export const getOrderUniqueId = (orderId: string) => {
  return `FUNNY::ORDERID:${orderId}`
}
