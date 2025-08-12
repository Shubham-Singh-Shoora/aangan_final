// Enhanced Image Upload Service
// Compresses images to avoid IC stable structure size limits

export interface ImageUploadService {
  uploadImage(file: File): Promise<string>;
  uploadMultipleImages(files: FileList): Promise<string[]>;
}

class SimpleImageService implements ImageUploadService {
  private compressImage(file: File, maxWidth: number = 600, quality: number = 0.5): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Check size (base64 is ~1.37x the binary size, keep under 2KB for safety)
        const estimatedSize = (compressedDataUrl.length * 0.75);
        console.log(`Image compressed to ${estimatedSize} bytes`);
        
        if (estimatedSize > 2000) { // Keep under 2KB for IC stable structures
          // If still too large, compress more aggressively
          const newQuality = Math.max(0.1, quality - 0.2);
          const newMaxWidth = Math.max(400, maxWidth * 0.8);
          if (newQuality >= 0.1) {
            this.compressImage(file, newMaxWidth, newQuality).then(resolve).catch(reject);
          } else {
            reject(new Error('Image too large even after maximum compression'));
          }
        } else {
          resolve(compressedDataUrl);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  async uploadImage(file: File): Promise<string> {
    try {
      // Compress the image to stay within IC size limits
      const compressedImage = await this.compressImage(file);
      
      // Final size check - reject if still too large
      const sizeInBytes = (compressedImage.length * 0.75);
      if (sizeInBytes > 2000) {
        throw new Error('Image too large even after compression. Please use a smaller image.');
      }
      
      return compressedImage;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw new Error('Failed to process image: ' + (error as Error).message);
    }
  }

  async uploadMultipleImages(files: FileList): Promise<string[]> {
    const uploadPromises = Array.from(files).map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }
}

// TODO: Implement IPFS service when ready
class IPFSImageService implements ImageUploadService {
  async uploadImage(file: File): Promise<string> {
    // Placeholder for IPFS implementation
    console.warn('IPFS not implemented yet, using SimpleImageService');
    const simpleService = new SimpleImageService();
    return simpleService.uploadImage(file);
  }

  async uploadMultipleImages(files: FileList): Promise<string[]> {
    const simpleService = new SimpleImageService();
    return simpleService.uploadMultipleImages(files);
  }
}

export const imageUploadService = new SimpleImageService();
export { SimpleImageService, IPFSImageService };
