const express=require('express')
const DesignController = require('../../controller/api/user/DesignApicontroller')


const router=express.Router()


router.post('/create/Design',DesignController.createDesign)
router.get('/Design/list',DesignController.listDesign)


module.exports=router