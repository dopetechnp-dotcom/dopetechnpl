import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Optimizes Supabase image URLs by converting them to use the render endpoint
 * with transformation parameters for better performance
 */
export function optimizeSupabaseImageUrl(imageUrl: string, width: number = 600, quality: number = 80): string {
  if (!imageUrl) return '/placeholder.png';
  
  // If it's already a local path or external URL, return as is
  if (imageUrl.startsWith('/') || imageUrl.startsWith('http') && !imageUrl.includes('supabase.co/storage')) {
    return imageUrl;
  }
  
  // Check if it's a Supabase storage URL
  if (imageUrl.includes('supabase.co/storage/v1/object/public/')) {
    // Convert from object endpoint to render endpoint
    const optimizedUrl = imageUrl.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    
    // Add transformation parameters
    const separator = optimizedUrl.includes('?') ? '&' : '?';
    return `${optimizedUrl}${separator}width=${width}&quality=${quality}`;
  }
  
  return imageUrl;
}

/**
 * Gets optimized image URL with fallback to placeholder
 */
export function getOptimizedImageUrl(imageUrl: string, width: number = 600, quality: number = 80): string {
  const optimized = optimizeSupabaseImageUrl(imageUrl, width, quality);
  return optimized || '/placeholder.png';
}
