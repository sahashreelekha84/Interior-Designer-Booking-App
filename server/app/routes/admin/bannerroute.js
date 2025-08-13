const express=require('express')
const BannerApiController = require('../../controller/admin/BannerController')
const StudentImageupload=require('../../helper/studentimageupload')
const router=express.Router()


router.post('/create',StudentImageupload.single('image'),BannerApiController.createbanner)

router.get('/edit/:id',BannerApiController.edit)
router.post('/update/:id',StudentImageupload.single('image'),BannerApiController.update)
router.get('/delete/:id',BannerApiController.delete)

module.exports=router