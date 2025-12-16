
// 时间格式化函数
function formatTimeAgo(timestamp: string): string {
  if (!timestamp) return '0';

  const now = new Date();
  const targetTime = new Date(timestamp);
  const diffInMs = now.getTime() - targetTime.getTime();

  // 转换为分钟、小时、天
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${Math.max(1, diffInMinutes)} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    return `${diffInDays} days ago`;
  }
}
