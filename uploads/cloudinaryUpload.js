const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: 'dtrvk6quc', // Ganti dengan cloud_name yang benar
  api_key: '821251785956655', // Ganti dengan api_key yang benar
  api_secret: 'r8lCkMbSWNdi-c-hYpGaRMKW6Og', // Ganti dengan api_secret yang benar
});

// Fungsi untuk upload gambar ke Cloudinary
const uploadImageToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { folder: 'projects' }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url); // Mengembalikan URL gambar dari Cloudinary
      }
    });
  });
};

// Fungsi untuk menghapus gambar dari Cloudinary
const deleteImageFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.log('Error deleting image:', error)
        reject(error);
      } else {
        console.log(`Cloudinary delete result: ${JSON.stringify(result)}`); // Debugging log
        resolve(result);
      }
    });
  });
};

module.exports = { uploadImageToCloudinary, deleteImageFromCloudinary };
