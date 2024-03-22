const cloudinary = require("../config/cloudinary");
const asyncHandler = require("express-async-handler");

module.exports.uploadImage = asyncHandler(async (folder, filePath) => {
  const img = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
  });

  return {
    url: img.secure_url,
    public_id: img.public_id,
  };
});

module.exports.deleteImage = asyncHandler(async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
  return true;
});

module.exports.uploadImages = async (folder, files) => {
  //This allows all the files to be uploaded in parallel to avoid the bottleneck of uploading one by one "timeOut error"
  const uploadPromises = files.map((file) =>
    cloudinary.uploader.upload(file.path, { folder })
  );

  const images = await Promise.all(uploadPromises);

  return images.map((img) => ({
    url: img.secure_url,
    public_id: img.public_id,
  }));
};

module.exports.deleteCloudFolder = asyncHandler(async (folder) => {
  folder = `${folder}`;

  await cloudinary.api.delete_resources_by_prefix(folder);
  await cloudinary.api.delete_folder(folder);
  return true;
});

module.exports.deleteMultipleImages = asyncHandler(async (public_ids) => {
  await cloudinary.api.delete_resources(public_ids);
  return true;
});
