import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";
export const getPosts=async (req,res)=>{
    try{
      const postMessages=await PostMessage.find();
   
      res.status(200).json(postMessages);
    }
    catch(error)
    {
      res.status(404).json({message:error.message});
    }
}

export const createPost=async (req,res)=>{
    const post = req.body;
    const newPostMessage=new PostMessage({...post,creator:req.userId,createdAt:new Date().toISOString()});
    
    try{
        await newPostMessage.save();
        res.status(201).json(newPostMessage);
    }
    catch(error){
          res.status(409).json({message:error.message})
    }
}

export const updatePost=async(req,res)=>{
  const {id:_id}=req.params;
  const post=req.body;
  if(!mongoose.Types.ObjectId.isValid(_id))
  return res.status(404).send("No post with that id");

  
  const updatedPost=await PostMessage.findByIdAndUpdate(_id,{...post,_id},{new:true});
  res.json(updatedPost);
}

export const deletePost=async(req,res)=>{
  const {id}=req.params;
  if(!mongoose.Types.ObjectId.isValid(id))
  return res.status(404).send("No post with that Id");
  await PostMessage.findByIdAndRemove(id);
  res.json({message:'Post deleted Successfully'});

}

export const likePost=async(req,res)=>{
  const {id}=req.params;
  if(!req.userId)
  return res.json({message:"Unauthenticated"});
  if(!mongoose.Types.ObjectId.isValid(id))
  return res.status(404).send("No post with that Id");
  const post=await PostMessage.findById(id);
  
  const index=post.likes.findIndex((id)=>id===String(req.userId));
  
  if(index===-1)
  {
    post.likes.push(req.userId)
  }
  else{
     post.likes=post.likes.filter((id)=>id!=String(req.userID));
  }
  const updatedPost=await PostMessage.findByIdAndUpdate(id,post,{new:true})
  res.json(updatedPost);
}

export const getPostsBySearch=async(req,res)=>
{  const {searchQuery,tags}=req.query;
   try{
     const title=new RegExp(searchQuery,'i');
     const posts=await PostMessage.find(
      {
        $or:[{title},{tags:{$in: tags.split(',')}}]
      }
     );
     res.json({data:posts});
   }
   catch(error)
   {
    res.status(404).json({message:error})
   }
}

export const commentPost=async(req,res)=>{
  
  try{
  const {id}=req.params;
  const {value}=req.body;
  const post=await PostMessage.findById(id);
  post.comments.push(value);
  const updatedPost=await PostMessage.findByIdAndUpdate(id,post,{new:true});
  res.json(updatedPost);
  }
  catch(error)
  {
    res.status(404).json({message:error})
  }
}