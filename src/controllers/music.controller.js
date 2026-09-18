const musicModel=require('../models/music.model');
const jwt=require('jsonwebtoken');
const {uploadFile}=require('../services/storage.service');
const albumModel=require('../models/album.model');
const userModel = require('../models/user.models');

async function createMusic(req,res){
    
   

    const {title}=req.body;
    const file=req.file;

    if (!title || !file) {
            return res.status(400).json({ message: "Bad Request: Both title and an audio file are required" });
        }

    // const result=await uploadFile(file.buffer.toString('base64'));

    const base64File = file.buffer.toString('base64');
    const result = await uploadFile(base64File);

    const music=await musicModel.create({
        uri:result.url,
        title,
        artist:req.user.id
    });
  

    

    return res.status(201).json({message:"Music created successfully",music:{
        id:music._id,
        title:music.title,
        uri:music.uri,
        artist:music.artist
    }})
}

    




async function createAlbum(req,res){
    
        const{title,musics}=req.body;
        
        if(!title || !musics || !Array.isArray(musics)){
            return res.status(400).json({message:"Bad Request: Title and musics array are required"});
        }

        const album=await albumModel.create({
            title,
            musics:musics,
            artist:req.user.id  
        })

        res.status(201).json({message:"Album created successfully",
            album:{
            id:album._id,
            title:album.title,
            musics:album.musics,
            artist:album.artist
        }})

    }
   

    async function getAllMusics(req,res){

        const musics=await musicModel.find().skip(0).limit(10).populate("artist");

        res.status(200).json({
            message:"Musics retrieved successfully",
            musics:musics,
        })
    }

    async function getAllAlbums(req,res){


        const albums=await albumModel.find().select("title artist ").populate("artist","username email");

        res.status(200).json({
            message:"Albums retrieved successfully",
            albums:albums,
        })
    }

    async function getAlbumById(req,res){
          const albumId=req.params.id;

          const album=await albumModel.findById(albumId).populate("musics").populate("artist","username email");

            if(!album){
                return res.status(404).json({message:"Album not found"});
            }

            res.status(200).json({
                message:"Album retrieved successfully",
                album:album,
            })

    }


    async function logoutUser(req,res){
        res.clearCookie("token");
        res.status(200).json({message:"User logged out successfully"});
    }

module.exports={
    createMusic,createAlbum,getAllMusics,getAllAlbums,getAlbumById,logoutUser
}