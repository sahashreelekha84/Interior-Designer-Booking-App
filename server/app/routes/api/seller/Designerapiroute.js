const express=require('express')
const DesignerApiController = require('../../../controller/api/seller/DesignerapiController')
const DesignerImageupload = require('../../../helper/Designerimageupload')
const Interiorimageupload = require('../../../helper/Interiorimageupload')
// const { Authcheck } = require('../../../middleware/Authcheck')





const router=express.Router()
router.post('/register/designer',DesignerImageupload.single('image'),DesignerApiController.createDesigner)
router.post('/designer/login',DesignerApiController.login)
router.get('/detailDesigner',DesignerApiController.Designerlist)
router.get('/editdesigner/:id',DesignerApiController.editdesigner)
router.post('/review',DesignerApiController.review)
router.post('/singlereview',DesignerApiController.getReviewByUserAndDesigner)
router.post('/uploadPortfolio',Interiorimageupload.array('images', 10),DesignerApiController.portfolio);
router.post('/subscription',DesignerApiController.updateSubscription)
// router.use(Authcheck)







module.exports=router