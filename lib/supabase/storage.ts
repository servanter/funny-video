import { supabase } from './supabase';

/**
 * 从 Supabase Storage 获取文件的公开 URL
 * @param bucketName - 存储桶名称
 * @param filePath - 文件路径（相对于存储桶的路径）
 * @returns 文件的公开 URL，如果获取失败则返回 null
 */
export async function getUrl(bucketName: string, filePath: string): Promise<string | null> {
  try {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('获取文件 URL 失败:', error);
    return null;
  }
}

/**
 * 从 Supabase Storage 获取文件的下载 URL（带有时效性）
 * @param bucketName - 存储桶名称
 * @param filePath - 文件路径（相对于存储桶的路径）
 * @param expiresIn - URL 过期时间（秒），默认 3600 秒（1小时）
 * @returns 文件的下载 URL，如果获取失败则返回 null
 */
export async function getTokenUrl(
  filePath: string,
  bucketName: string = process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET || '',
  expiresIn: number = 1800
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw error;
    }

    const signedUrl = data?.signedUrl || null;
    return data.signedUrl;
  } catch (error) {
    console.error('获取下载 URL 失败:', error);
    return null;
  }
}

/**
 * 批量获取多个文件的下载 URL（带有时效性）
 * @param filePaths - 文件路径数组（相对于存储桶的路径）
 * @param bucketName - 存储桶名称
 * @param expiresIn - URL 过期时间（秒），默认 1800 秒（30分钟）
 * @returns 文件的下载 URL 数组，如果获取失败则返回 null
 */
export async function getTokenUrls(
  filePaths: string[],
  bucketName: string = process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET || '',
  expiresIn: number = 1800
): Promise<Array<{ path: string; signedUrl: string }> | null> {

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrls(filePaths, expiresIn);

    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('批量获取下载 URL 失败:', error);
    return null;
  }
}

/**
 * 获取存储桶中的所有文件列表
 * @param bucketName - 存储桶名称
 * @param folderPath - 文件夹路径（可选）
 * @returns 文件列表，如果获取失败则返回空数组
 */
export async function listFiles(bucketName: string, folderPath?: string): Promise<any[]> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('获取文件列表失败:', error);
    return [];
  }
}

/**
 * 上传文件到 Supabase Storage
 * @param bucketName - 存储桶名称
 * @param filePath - 文件路径（相对于存储桶的路径）
 * @param file - 要上传的文件（File 对象或 Blob）
 * @returns 上传结果，包含文件信息
 */
export async function uploadFile(
  bucketName: string,
  filePath: string,
  file: File | Blob
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('文件上传失败:', error);
    return { success: false, error };
  }
}

/**
 * 从 Supabase Storage 删除文件
 * @param bucketName - 存储桶名称
 * @param filePaths - 要删除的文件路径数组
 * @returns 删除结果
 */
export async function deleteFiles(
  bucketName: string,
  filePaths: string[]
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove(filePaths);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('文件删除失败:', error);
    return { success: false, error };
  }
}