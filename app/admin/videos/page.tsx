'use client';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Video } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function VideoPage() {
    const router = useRouter();
    const [videoItems, setVideoItems] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 固定的user_id
    const FIXED_USER_ID = "default_user";

    useEffect(() => {
        // 调用API获取视频数据
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/videos?user_id=${FIXED_USER_ID}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    setVideoItems(result.data.videos);
                } else {
                    setError(result.message || "获取视频数据失败");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "未知错误");
                console.error("获取视频数据失败:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // 加载状态
    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-start">
                <div>
                    <Skeleton className="h-60 w-75 rounded-xl bg-gray-200" />
                    <Skeleton className="h-6 w-75 bg-gray-200 mt-4" />
                </div>
                <div>
                    <Skeleton className="h-60 w-75 rounded-xl bg-gray-200" />
                    <Skeleton className="h-6 w-75 bg-gray-200 mt-4" />
                </div>
                <div>
                    <Skeleton className="h-60 w-75 rounded-xl bg-gray-200" />
                    <Skeleton className="h-6 w-75 bg-gray-200 mt-4" />
                </div>
                <div>
                    <Skeleton className="h-60 w-75 rounded-xl bg-gray-200" />
                    <Skeleton className="h-6 w-75 bg-gray-200 mt-4" />
                </div>
            </div>
        );
    }

    // 错误状态
    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500 text-lg">错误: {error}</div>
            </div>
        );
    }

    // 空数据状态
    if (videoItems.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500 text-lg">暂无视频数据</div>
            </div>
        );
    }

    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-start">
                {videoItems.map((item) => (
                    <div
                        key={item.id}
                        className="w-75 border border-gray-300 rounded-lg bg-card overflow-hidden relative group transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                        {/* 图片容器 */}
                        <div className="relative overflow-hidden">
                            <img
                                src={item.first_image_url}
                                alt={item.title}
                                className="w-full h-auto transition-all duration-300 group-hover:scale-110 opacity-0 animate-fade-in"
                                onLoad={(e) => {
                                    // 图片加载完成后移除透明效果
                                    e.currentTarget.classList.remove('opacity-0');
                                }}
                            />

                            {/* 描述文字和按钮容器 */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/50 to-transparent">
                                <div className="text-white text-center mb-3">
                                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                    <p className="text-sm opacity-90">{item.description}</p>
                                </div>
                                <Button className="w-full bg-white text-black hover:bg-gray-100 transition-colors duration-200" onClick={() => router.push(`/admin/videos/${item.id}`)}>
                                    立即观看
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}