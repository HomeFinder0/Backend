const cloudinary = require("../config/cloudinary");
const asyncHandler = require("express-async-handler");

const uploadImage = asyncHandler(async (folder, filePath) => {
  const img = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
  });

  return {
    url: img.secure_url,
    public_id: img.public_id,
  };
});

const deleteImage = asyncHandler(async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
  return true;
});

const uploadCloudFolder = async (objId, files) => {
  //This allows all the files to be uploaded in parallel to avoid the bottleneck of uploading one by one "timeOut error"
  const uploadPromises = files.map((file) =>
    cloudinary.uploader.upload(file.path, { folder: `${objId}` })
  );

  const images = await Promise.all(uploadPromises);
  return images.map((img) => ({
    url: img.secure_url,
    public_id: img.public_id,
  }));
};

const deleteCloudFolder = asyncHandler(async (objId) => {
  const folderName = `${objId}`;

  await cloudinary.api.delete_resources_by_prefix(folderName);
  await cloudinary.api.delete_folder(folderName);
  return {};
});

module.exports = {
  uploadImage,
  deleteImage,

  uploadCloudFolder,
  deleteCloudFolder,
};
