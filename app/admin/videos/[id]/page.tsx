'use client';
import { Video } from '@prisma/client';
import { Undo2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function VideoDetailPage() {
  const params = useParams();
  const videoId = params?.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);

        // 调用API获取视频详情
        const response = await fetch(`/api/videos/${videoId}`);

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">错误: {error}</div>
      </div>
    );
  }

  // 视频不存在
  if (!video) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">视频不存在</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 视频标题 */}
        <h1 className="text-3xl font-bold text-center mb-8">{video.title}</h1>

        {/* 视频描述 */}
        {video.description && (
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            {video.description}
          </p>
        )}

        {/* 视频播放器容器 - 居中显示 */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl bg-black rounded-lg overflow-hidden shadow-2xl">
            {/* 视频播放器 */}
            <video
              controls
              className="w-full h-auto max-h-[70vh]"
              poster={video.first_image_url}
              preload="metadata"
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              您的浏览器不支持视频播放。
            </video>
          </div>
        </div>

        {/* 视频信息 */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">视频信息</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><span className="font-medium">视频ID:</span> {video.id}</div>
                <div><span className="font-medium">创建时间:</span> {new Date(video.create_time).toLocaleString()}</div>
                <div><span className="font-medium">更新时间:</span> {new Date(video.update_time).toLocaleString()}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">用户信息</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><span className="font-medium">用户ID:</span> {video.user_id}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex justify-between gap-1"
          >
            Back<Undo2 />
          </button>
        </div>
      </div>
    </div>
  );
}