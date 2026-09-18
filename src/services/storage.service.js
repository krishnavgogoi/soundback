const {ImageKit}=require('@imagekit/nodejs');
require('dotenv').config();

const ImageKitClient=new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
});


async function uploadFile(fileData){

const result=await ImageKitClient.files.upload({
    file:fileData,
    fileName:"music_"+Date.now(),
    folder:"yt-complete-backend/music"

});
return result;
}

module.exports={
    uploadFile
}