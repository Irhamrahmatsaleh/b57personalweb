const cloudinary = require('cloudinary').v2;
const path = require('path');

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

// Fungsi untuk upload user profile
const uploadToCloudinary = (filePath, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder: folder },
      (error, result) => {
        if (result) {
          resolve(result.secure_url); // Mengembalikan URL secure dari Cloudinary
        } else {
          reject(error);
        }
      }
    );
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

// update image
// Fungsi upload
const uploadImage = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { cache: "no-cache" }, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

// Fungsi untuk menghapus gambar dari Cloudinary
const deleteImage = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};


module.exports = { uploadImageToCloudinary, deleteImageFromCloudinary, uploadToCloudinary, uploadImage, deleteImage };
