const express=require('express')


const BookappointmentApiController = require('../../../controller/api/user/BookappointmentApiController')
const router=express.Router()
router.post('/bookappointment',BookappointmentApiController.bookappointment)
router.get('/allappointment',BookappointmentApiController.allAppointment)
router.post('/cancelAppointment',BookappointmentApiController.cancelAppointment)
router.post('/completeAppointment',BookappointmentApiController.completeAppointment)
router.post('/confirmedAppointment',BookappointmentApiController.confirmedAppointment)
router.post('/updateAppointment',BookappointmentApiController.updateAppointment)

module.exports=router
