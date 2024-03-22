const cloudinary = require("../config/cloudinary");
const asyncHandler = require("express-async-handler");
const appError = require("./appError");
module.exports.uploadImage = asyncHandler(async (folder, filePath, next) => {
  try {
    const img = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
    });

    return {
      url: img.secure_url,
      public_id: img.public_id,
    };
  } catch (error) {
    return next(new appError("Error uploading images", 500));
  }
});

module.exports.deleteImage = asyncHandler(async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.log(error);
  }
});

module.exports.uploadImages = asyncHandler(async (folder, files, next) => {
  //This allows all the files to be uploaded in parallel to avoid the bottleneck of uploading one by one "timeOut error"
  try {
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder })
    );

    const images = await Promise.all(uploadPromises);

    return images.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));
  } catch (error) {
    return next(new appError("Error uploading images", 500));
  }
});

module.exports.deleteCloudFolder = asyncHandler(async (folder) => {
  folder = `${folder}`;
  try {
    await cloudinary.api.delete_resources_by_prefix(folder);
    await cloudinary.api.delete_folder(folder);
  } catch (error) {
    console.log(error);
  }
});

module.exports.deleteMultipleImages = asyncHandler(async (public_ids) => {
  try {
    await cloudinary.api.delete_resources(public_ids);
  } catch (error) {
    console.log(error);
  }
  return true;
});