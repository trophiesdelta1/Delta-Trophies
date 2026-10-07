const getImageUrl = (path) => {
  if (!path) return null;

  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  const apiOrigin = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiOrigin}${normalizedPath}`;
};

const WATERMARK_TRANSFORMATION =
  'l_text:Arial_48_bold:Delta%20Trophies,co_rgb:8B6A22/c_scale,fl_relative,w_0.5/o_30/fl_layer_apply,g_center';

const getCloudinaryImageUrl = (
  path,
  { width, height, quality = 'auto:best' } = {},
  watermark = false,
) => {
  const originalUrl = getImageUrl(path);
  if (!originalUrl || !/^https:\/\/res\.cloudinary\.com\//i.test(originalUrl)) {
    return originalUrl;
  }

  const uploadMarker = '/image/upload/';
  if (!originalUrl.includes(uploadMarker)) return originalUrl;

  const transformation = [
    'c_limit',
    'f_auto',
    'fl_progressive',
    `q_${quality}`,
    Number.isInteger(width) && width > 0 ? `w_${width}` : null,
    Number.isInteger(height) && height > 0 ? `h_${height}` : null,
  ]
    .filter(Boolean)
    .join(',');

  return originalUrl.replace(
    uploadMarker,
    `${uploadMarker}${transformation}/${watermark ? `${WATERMARK_TRANSFORMATION}/` : ''}`,
  );
};

export const getOptimizedImageUrl = (path, options) =>
  getCloudinaryImageUrl(path, options);

export const getWatermarkedImageUrl = (path, options) =>
  getCloudinaryImageUrl(path, options, true);

export default getImageUrl;
