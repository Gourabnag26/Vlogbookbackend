import mongoose from "mongoose";
const Schema = mongoose.Schema;
const postSchema=Schema(
    {
      title:String,
      about:String,
      name:String,
      creator:String,
      location:String,
      city:String,
      lat:String,
      lon:String,
      comments:{
        type:[String],default:[],
      },

      createdAt: { type: Date, default: new Date() },
      tags:[String],
      SelectedFile:String,
      likes:{
        type:[String],default:[],
      }


    }
);

const PostMessage=mongoose.model('PostMessage',postSchema);

export default PostMessage;