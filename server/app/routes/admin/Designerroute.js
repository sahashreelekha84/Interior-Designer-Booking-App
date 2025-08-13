const express=require('express')
const DesignerApiController = require('../../controller/admin/DesignerController')
const DesignerImageupload = require('../../helper/Designerimageupload')
const DesignerController = require('../../controller/admin/DesignerController')

const router=express.Router()


router.post('/create/Designer',DesignerImageupload.single('image'),DesignerApiController.createDesigner)
router.get('/Designer/list',DesignerApiController.listDesigner)
router.get('/Designer/add',DesignerApiController.addPageDesigner)
router.get('/editDesigner/:id',DesignerApiController.edit)
router.post('/updateDesigner/:id',DesignerImageupload.single('image'),DesignerApiController.update)
router.get('/deleteDesigner/:id',DesignerApiController.delete)
router.get('/designertoggle/:id',DesignerApiController.toggleDesignerStatus);
router.get('/contact/list',DesignerApiController.getallsms)
module.exports=router