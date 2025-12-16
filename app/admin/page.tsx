'use client';

import { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// 时间戳转日期字符串函数
function formatTimestamp(timestamp: number): string {
  if (!timestamp) return '';

  // 尝试不同的时间戳格式
  let date: Date;

  // 如果是毫秒级时间戳（13位）
  if (timestamp > 1000000000000) {
    date = new Date(timestamp);
  }
  // 如果是秒级时间戳（10位）
  else if (timestamp > 1000000000) {
    date = new Date(timestamp * 1000);
  }
  // 其他情况，可能是错误的格式
  else {
    console.warn('Invalid timestamp format:', timestamp);
    return 'Invalid date';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [lastLogin, setLastLogin] = useState<string>('');
  const [afterMonthCount, setAfterMonthCount] = useState<string>('');
  const [totalVideos, setTotalVideos] = useState<number>(0);
  const [membershipTodayRemaing, setMembershipTodayRemaing] = useState<number>(0);
  const [boostPackRemaining, setBoostPackRemaining] = useState<number>(0);
  const [membershipExpire, setMembershipExpire] = useState<number>(0);
  const [membershipExpireFormatted, setMembershipExpireFormatted] = useState<string>('');

  const [remainingStr, setRemainingStr] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoStats = async () => {
      try {
        const response = await fetch('/api/admin');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data);
          setChartData(data.monthsData);
          setTotalVideos(data.totalCount || 0);
          setAfterMonthCount(data.afterMonthCount || 0);

          // 包月用户
          if (data.user.role === 2) {
            setMembershipTodayRemaing(data.user.membershipTodayRemaing || 0);
            setMembershipExpire(data.user.membershipExpire || 0);
            // 格式化会员到期时间
            const formattedExpire = formatTimestamp(data.user.membershipExpire);
            setMembershipExpireFormatted(formattedExpire);
            setRemainingStr(data.user.boostPackRemaining + ' + ' + data.user.membershipTodayRemaing);
          } else {
            setBoostPackRemaining(data.user.boostPackRemaining || 0);
            setRemainingStr(data.user.boostPackRemaining);
          }


          // 处理最后登录时间
          if (data.update_time) {
            const formattedTime = formatTimeAgo(data.update_time);
            setLastLogin(formattedTime);
          }
        } else {
          console.error('Failed to fetch video statistics');
        }
      } catch (error) {
        console.error('Error fetching video statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your dashboard</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Last Login Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
            <p className="text-2xl text-gray-500 mt-2">Loading...</p>
          </div>

          {/* Total Videos Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Videos</h3>
            <p className="text-2xl text-gray-500 mt-2">Loading...</p>
          </div>

          {/* Remaining Credits Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Remaining Credits</h3>
            <p className="text-2xl text-gray-500 mt-2">Loading...</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Video Trends</h3>
          <div className="h-56 flex items-center justify-center">
            <p className="text-gray-500">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 上面部分 - 标题和描述 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your dashboard</p>
      </div>

      {/* 中间部分 - 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Last Login Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {lastLogin || '2 hours ago'}
          </p>
          <p className="text-sm text-purple-600 mt-1">Active now</p>
        </div>

        {/* Total Videos Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Videos</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {totalVideos?.toString() || '0'}
          </p>
          <p className="text-sm text-purple-600 mt-1">
            +{afterMonthCount} new videos from last month
          </p>
        </div>

        {/* Remaining Credits Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Remaining Credits</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {remainingStr}
            <span className="text-sm text-purple-600 ml-1 italic font-normal">
              {membershipExpire > 0 ? `(VIP Expires on: ${membershipExpireFormatted})` : ''}
            </span>
          </p>
          <p className="text-sm text-purple-600 mt-1">Credits available</p>
        </div>
      </div>

      {/* 底部部分 - 折线图 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Video Trends</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Videos"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
