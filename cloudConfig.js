const cloudinary = require('cloudinary').v2;
const { closeDelimiter } = require('ejs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ // congif -. We add the folder to the code , config means add something 
    cloud_name :process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder : "wanderlust_DEV",
        allowerdFormats: ["png" , "jpg" , "jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage,
};



