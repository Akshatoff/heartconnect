const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate image file before upload
 */
export function validateImage(file: File): ImageValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File size must be less than 5MB",
    };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "File must be JPEG, PNG, WebP, or GIF",
    };
  }

  return { valid: true };
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(
  file: File,
  maxWidth: number = 2000,
  maxHeight: number = 2000,
): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          valid: false,
          error: `Image dimensions must not exceed ${maxWidth}x${maxHeight}px`,
        });
      } else {
        resolve({ valid: true });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: "Invalid image file",
      });
    };

    img.src = url;
  });
}

/**
 * Generate unique filename
 */
export function generateUniqueFileName(
  originalName: string,
  userId: string,
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const extension = originalName.split(".").pop()?.toLowerCase() || "jpg";

  return `${userId}_${timestamp}_${random}.${extension}`;
}
