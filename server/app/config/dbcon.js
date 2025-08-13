const mongoose=require('mongoose')
const dbcon=async()=>{
    try{
const db=await mongoose.connect(process.env.MONGODB_URL)
if(db){
    console.log('Database Connected Succesfully');
    
}
    }catch(error){
        console.log('connection failed');
        
    }
}
module.exports=dbcon