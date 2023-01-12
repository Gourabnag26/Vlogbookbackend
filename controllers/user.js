import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../models/user.js';
import mongoose from "mongoose";

export const signin=async(req,res)=>{
 const{email,password}=req.body;
 try{
  const existingUSer=await user.findOne({email});
  if(!existingUSer)
  return res.status(404).json({message:"USer doesn't exist"})
  const isPasswordCorrect=await bcrypt.compare(password,existingUSer.password);
  if(!isPasswordCorrect)
  return res.status(400).json({message: "Invalid Credential"})

  const token=jwt.sign({email:existingUSer.email,id:existingUSer._id},'test',{expiresIn:'1h'})
  res.status(200).json({result:existingUSer,token});
 }
 catch(error)
 {
  res.status(500).json({message:'Something went wrong'})
 }
}
export const signup=async(req,res)=>{
    const {email,password,confirmPassword,firstName,lastName}=req.body;
    try{
       const existingUSer=await user.findOne({email});
       if(existingUSer)
       return res.status(400).json({message:"USer already exist"})
       if(password != confirmPassword) return res.status(400).json({message:"Passwords don't match"})
       const hashedPassword =await bcrypt.hash(password,12);
       const result=await user.create({email,password :hashedPassword,name:`${firstName} ${lastName}`})
       
     const token=jwt.sign({email:result.email,id:result._id},'test',{expiresIn:'12h'})
     res.status(200).json({result:result,token});
    }
    catch(error)
    {
        res.status(500).json({message:'Something went wrong'})
    }

}
