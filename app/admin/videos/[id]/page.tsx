'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { Video } from '@prisma/client';
import { Undo2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function VideoDetailPage() {
  const params = useParams();
  const videoId = params?.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);
        // 调用API获取视频详情
        const response = await fetch(`/api/admin/videos/${videoId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          const videoData = result.data.video;
          setVideo(videoData);
          setVideoUrl(videoData.result_video_url);
        } else {
          setError(result.message || '获取视频详情失败');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
        console.error('获取视频详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetail();
    }
  }, [videoId]);

  // 加载状态
  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <Skeleton className="h-3/4 w-2/4 rounded-xl bg-gray-200" />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="text-red-500 text-lg">ERROR： {error}</div>
      </div>
    );
  }

  // 视频不存在
  if (!video) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="text-gray-500 text-lg">404 Not Found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* 左侧 - 视频播放器 */}
        <div className="lg:w-1/2 flex flex-col">
          {/* 标题和描述 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{video.title}</h1>
            {video.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {video.description}
              </p>
            )}
          </div>

          {/* 视频播放器 */}
          <div className="bg-black rounded-xl overflow-hidden shadow-lg flex-1 flex items-center justify-center">
            <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 比例 */}
              <video
                controls
                className="absolute inset-0 w-full h-full object-cover"
                poster={video.first_image_url}
                preload="metadata"
              >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                您的浏览器不支持视频播放。
              </video>
            </div>
          </div>
        </div>

        {/* 右侧 - 视频信息和操作 */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          {/* 视频信息卡片 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">视频信息</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">视频ID</span>
                <span className="text-sm text-gray-900 font-mono">{video.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">创建时间</span>
                <span className="text-sm text-gray-900">{new Date(video.create_time).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">更新时间</span>
                <span className="text-sm text-gray-900">{new Date(video.update_time).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 用户信息卡片 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">用户信息</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">用户ID</span>
                <span className="text-sm text-gray-900 font-mono">{video.user_id}</span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">操作</h3>
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Undo2 size={18} />
              返回列表
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}