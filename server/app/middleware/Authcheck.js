const jwt=require('jsonwebtoken')
const bycrptjs=require('bcryptjs')

const hashpassword=(password)=>{
const salt=10
const hash=bycrptjs.hashSync(password,salt)
return hash
}
const comparepassword=(password,hashpassword)=>{
    return bycrptjs.compareSync(password,hashpassword)

}
const Authcheck=(req,res,next)=>{
const token=req?.body?.token || req?.headers['x-access-token']
if(!token){
    return res.status(400).json({
        status:false,
        message:"please login first to access this page"
    })
}
try{
const decoded=jwt.verify(token,process.env.JWT_SECRECT_KEY)
 req.user=decoded
}
catch(error){
    return res.status(400).json({
        status:false,
        message:error.message
    })
}
next()
}
// const checkDesignerActive = async (req, res, next) => {
//   const designer = await Designer.findById(req.user.id);
//   if (!designer?.isActive) {
//     return res.status(403).json({ message: 'Subscription expired or not approved' });
//   }
//   next();
// };

module.exports={hashpassword,comparepassword,Authcheck}