const mongoose=require('mongoose')
const Schema=mongoose.Schema
// const { softDeletePlugin } = require('soft-delete-plugin-mongoose');


const bannerSchema=new Schema({

    title:{
        type:String,
        require:true
    },
    subtitle:{
        type:String,
        required:true,
    },
 
    image:{
        type:String,
        require:true
    },
    isDeleted: {
        type: Boolean,
        default: false
      },
},

{ timestamps: true })
// StudentSchema.plugin(softDeletePlugin);
const BannerModel=mongoose.model('banner',bannerSchema)
module.exports=BannerModel