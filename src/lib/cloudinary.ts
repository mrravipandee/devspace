import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Upload image to Cloudinary
export const uploadImage = async (file: Buffer, folder: string = 'devspace-profiles') => {
  try {
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${file.toString('base64')}`,
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      }
    );
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: 'Failed to upload image'
    };
  }
};

// Delete image from Cloudinary
export const deleteImage = async (public_id: string) => {
  try {
    await cloudinary.uploader.destroy(public_id);
    return { success: true };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: 'Failed to delete image' };
  }
};
