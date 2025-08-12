// Enhanced Image Upload Service
// Allows large images without compression

export interface ImageUploadService {
  uploadImage(file: File): Promise<string>;
  uploadMultipleImages(files: FileList): Promise<string[]>;
}

class SimpleImageService implements ImageUploadService {
  async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          // Return full base64 data URL without compression
          resolve(reader.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
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
