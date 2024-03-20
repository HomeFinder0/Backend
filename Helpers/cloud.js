const asyncHandler = require("express-async-handler");
const cloudinary = require('../config/cloudinary');

const upload_image_to_cloud = asyncHandler(async(data, filePath)=>{
        const img = await cloudinary.uploader.upload(filePath, function(error, result) {
            if(error) return null;
        });

        data.image.url       = img.secure_url;
        data.image.public_id = img.public_id;
        
        return img;
});
const delete_image_from_cloud = asyncHandler(async(public_id)=>{
    const img = await cloudinary.uploader.destroy(public_id, function(error, result) {
        if(error) return null;
    });
    return img;
})


const upload_messages = asyncHandler(async(conversationId, newMessage, filesPath)=>{
        let folderName = `${conversationId}`;
        const img = await cloudinary.uploader.upload(filesPath, {folder: folderName},function(error, result) {
            if(error) return null;
        });
        
        newMessage.message.media.push({
            url: img.secure_url,
            public_id: img.public_id
        });
        
        return newMessage.message.media;
});

const delete_messages = asyncHandler(async(conversationId)=>{
    let folderName = `${conversationId}`; 
    const img = await cloudinary.api.delete_resources_by_prefix(folderName, function(error, result) {
        if(error) return null;
    });
    return img;
});

module.exports = {
    upload_image_to_cloud,
    delete_image_from_cloud,
    
    upload_messages,
    delete_messages
};

