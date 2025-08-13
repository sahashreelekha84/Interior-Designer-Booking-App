const appointmentModel = require('../../../model/appoinmentmodel');
const DesignerModel = require('../../../model/Designermodel');
const userModel = require('../../../model/usermodel');

class BookappointmentApiController {

  // async bookappointment(req, res) {
  //   try {
  //     const { userId, designerId, slotDate, slotTime } = req.body;

  //     const designer = await DesignerModel.findById(designerId);
  //     console.log(designer.designername);

  //     if (!designer) {
  //       return res.status(404).json({ status: false, message: 'Designer not found' });
  //     }
  //     const user = await userModel.findById(userId);
  //     console.log(user.fullname);

  //     if (!user) {
  //       return res.status(404).json({ status: false, message: 'user not found' });
  //     }
  //     // Check if slot with same date+time is already booked
  //     const alreadyBooked = designer.slots_booked.find(
  //       (slot) => slot.date === slotDate && slot.time === slotTime && slot.status === 'booked' && slot.userId === userId
  //     );
  //     // if (alreadyBooked) {
  //     //   return res.status(400).json({ status: false, message: 'Slot already booked' });
  //     // }

  //     // 2. Validate date format and check if it's not in the past
  //     const [day, month, year] = slotDate.split('/');
  //     const [hour, minute] = slotTime.split(':');

  //     // Correct full datetime
  //     const selectedDateTime = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
  //     const now = new Date();

  //     if (isNaN(selectedDateTime.getTime())) {
  //       return res.status(400).json({ status: false, message: 'Invalid slot date or time format' });
  //     }

  //     if (selectedDateTime < now) {
  //       return res.status(400).json({ status: false, message: 'Cannot book a slot on a past time or past date' });
  //     }

  //     // Check if the user has already booked any slot on the same date
  //     const existingBookingWithSameDate = await DesignerModel.findOne({
  //       'slots_booked': {
  //         $elemMatch: {
  //           userId,
  //           designerId,
  //           date: slotDate,

  //           status: 'booked',
  //         }
  //       }
  //     });

  //     if (existingBookingWithSameDate) {
  //       return res.status(400).json({
  //         status: false,
  //         message: 'You have already booked an appointment on this date'
  //       });
  //     }
  //     // const totalSlots = designer.slots_booked.length;
  //     // Find existing available slot
  //     const slotIndex = designer.slots_booked.findIndex(
  //       (slot) => slot.date === slotDate && slot.time === slotTime && slot.status === 'cancelled'
  //     );


  //     if (slotIndex !== -1) {
  //       // Update existing available slot
  //       designer.slots_booked[slotIndex].status = 'booked';
  //       designer.slots_booked[slotIndex].userId = userId;
  //     } else {
  //       // If no available slot exists, add a new one
  //       designer.slots_booked.push({
  //         date: slotDate,
  //         time: slotTime,

  //         userId,
  //         designerId,
  //         designername: designer.designername,
  //         user: user.fullname,
  //         status: 'booked'
  //       });
  //     }

  //     designer.markModified('slots_booked');
  //     const totalBookedSlots = designer.slots_booked.filter(slot => slot.status === 'booked').length;

  //     // Store totalSlots and optionally bookedCount
  //     designer.totalSlots = designer.slots_booked.length;
  //     designer.bookedCount = totalBookedSlots;

  //     await designer.save();




  //     res.status(200).json({
  //       status: true,
  //       message: 'Dashboard data fetched',
  //       designer: {
  //         _id: designer._id,
  //         name: designer.designername,
  //         slots_booked: designer.slots_booked,
  //         totalBookedSlots
  //       }
  //     });
  //     // const adata = await new appointmentModel({ designerId, userId, slotDate, slotTime,user:user.fullname,designername: designer.designername })
  //     // const data = await adata.save()

  //     // return res.status(200).json({
  //     //   status: true,
  //     //   message: 'Appointment booked successfully',
  //     //   data: data
  //     // });
  //     let createdAppointments = [];

  //     for (const slot of designer.slots_booked) {
  //       const appointmentExists = await appointmentModel.findOne({
  //         userId: slot.userId,
  //         designerId: slot.designerId,
  //         slotDate: slot.date,
  //         slotTime: slot.time
  //       });

  //       if (!appointmentExists) {
  //         const appointment = new appointmentModel({
  //           userId: slot.userId,
  //           designerId: slot.designerId,
  //           user: slot.user,
  //           designername: slot.designername,
  //           slotDate: slot.date,
  //           slotTime: slot.time,
  //           status: slot.status
  //         });

  //         const saved = await appointment.save();
  //         createdAppointments.push(saved);
  //       }
  //     }


  //     if (createdAppointments.length > 0) {
  //       return res.status(200).json({
  //         status: true,
  //         message: 'Appointments booked successfully',
  //         data: createdAppointments
  //       });
  //     } else {
  //       return res.status(200).json({
  //         status: false,
  //         message: 'No new appointments were added (duplicates skipped)',
  //         data: []
  //       });
  //     }


  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ status: false, message: error.message });
  //   }
  // }
async bookappointment(req, res) {
  try {
    const { userId, designerId, slotDate, slotTime,purpose} = req.body;

    const designer = await DesignerModel.findById(designerId);
    if (!designer) {
      return res.status(404).json({ status: false, message: 'Designer not found' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const [day, month, year] = slotDate.split('/');
    const [hour, minute] = slotTime.split(':');
    const selectedDateTime = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
    const now = new Date();

    if (isNaN(selectedDateTime.getTime())) {
      return res.status(400).json({ status: false, message: 'Invalid slot date or time format' });
    }

    if (selectedDateTime < now) {
      return res.status(400).json({ status: false, message: 'Cannot book a slot on a past date/time' });
    }

    const existingBookingWithSameDate = await DesignerModel.findOne({
      'slots_booked': {
        $elemMatch: {
          userId,
          designerId,
          date: slotDate,
          status: 'booked'
        }
      }
    });

    if (existingBookingWithSameDate) {
      return res.status(400).json({
        status: false,
        message: 'You have already booked an appointment on this date'
      });
    }

    const slotIndex = designer.slots_booked.findIndex(
      (slot) => slot.date === slotDate && slot.time === slotTime && slot.status === 'cancelled'
    );

    if (slotIndex !== -1) {
      // Reuse cancelled slot
      designer.slots_booked[slotIndex].status = 'booked';
      designer.slots_booked[slotIndex].userId = userId;
      designer.slots_booked[slotIndex].user = user.fullname;
    } else {
      // Add new slot
      designer.slots_booked.push({
        date: slotDate,
        time: slotTime,
        userId,
        designerId,
        designername: designer.designername,
        user: user.fullname,
        phone:user.phone,
        email:user.email,
        status: 'booked',
        purpose
      });
    }

    designer.markModified('slots_booked');

    // 🧮 Calculate stats
    const totalAppointments = designer.slots_booked.length;
    const bookedCount = designer.slots_booked.filter(slot => slot.status === 'booked').length;
    const uniqueClientIds = new Set(designer.slots_booked.map(slot => slot.userId?.toString()));
    const totalClients = uniqueClientIds.size;

    // 📝 Store in DB
    designer.totalSlots = totalAppointments;
    designer.bookedCount = bookedCount;
    designer.totalClients = totalClients;

    await designer.save();

    // 🔁 Create appointment documents if not already existing
    let createdAppointments = [];

    for (const slot of designer.slots_booked) {
      const appointmentExists = await appointmentModel.findOne({
        userId: slot.userId,
        designerId: slot.designerId,
        slotDate: slot.date,
        slotTime: slot.time
      });

      if (!appointmentExists) {
        const appointment = new appointmentModel({
          userId: slot.userId,
          designerId: slot.designerId,
          user: slot.user,
          designername: slot.designername,
          slotDate: slot.date,
          slotTime: slot.time,
          status: slot.status
        });

        const saved = await appointment.save();
        createdAppointments.push(saved);
      }
    }

    if (createdAppointments.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Appointment booked successfully',
        designer: {
          _id: designer._id,
          designername: designer.designername,
          totalSlots: designer.totalSlots,
          bookedCount: designer.bookedCount,
          totalClients: designer.totalClients,
          slots_booked: designer.slots_booked
        },
        appointments: createdAppointments
      });
    } else {
      return res.status(200).json({
        status: false,
        message: 'No new appointments were added (duplicates skipped)',
        data: []
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
}

  async cancelAppointment(req, res) {
    try {
      const { designerId, slotDate, slotTime, userId } = req.body;

      const designer = await DesignerModel.findById(designerId);
      if (!designer) {
        return res.status(404).json({ status: false, message: 'Designer not found' });
      }

      console.log("Requested cancel:");
      console.log("slotDate:", slotDate);
      console.log("slotTime:", slotTime);
      console.log("userId:", userId);
      console.log("Booked Slots:", designer.slots_booked);


      const slotIndex = designer.slots_booked.findIndex(s =>
        s.time === slotTime &&
        String(s.userId) === String(userId) &&
        (!s.date || s.date === slotDate) // skip if date not stored
      );

      if (slotIndex === -1) {
        return res.status(404).json({
          status: false,
          message: 'Slot not found for this user on this date/time',
        });
      }

      // Update slot
      designer.slots_booked[slotIndex].status = 'cancelled';
      designer.markModified('slots_booked');


      await designer.save();

      return res.status(200).json({
        status: true,
        message: 'Appointment cancelled successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }


  async completeAppointment(req, res) {
    try {
      const { designerId, slotDate, slotTime, userId } = req.body;

      const designer = await DesignerModel.findById(designerId);
      if (!designer) {
        return res.status(404).json({ status: false, message: 'Designer not found' });
      }

      const slot = designer.slots_booked.find(
        s =>
          s.date === slotDate &&
          s.time === slotTime &&
          String(s.userId) === String(userId)
      );

      if (!slot) {
        return res.status(404).json({ status: false, message: 'Slot not found' });
      }

      slot.status = 'completed';

      await designer.save();

      return res.status(200).json({ status: true, message: 'Appointment marked as completed.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: error.message });
    }
  }
  async confirmedAppointment(req, res) {
    try {
      const { designerId, slotDate, slotTime, userId } = req.body;

      const designer = await DesignerModel.findById(designerId);
      if (!designer) {
        return res.status(404).json({ status: false, message: 'Designer not found' });
      }

      const slot = designer.slots_booked.find(
        s =>
          s.date === slotDate &&
          s.time === slotTime &&
          String(s.userId) === String(userId)
      );

      if (!slot) {
        return res.status(404).json({ status: false, message: 'Slot not found' });
      }

      slot.status = 'confirmed';

      await designer.save();

      return res.status(200).json({ status: true, message: 'Appointment marked as confirmed.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: error.message });
    }
  }

  async updateAppointment(req, res) {
    const { designerId, slotDate, slotTime, userId,purpose } = req.body;

    try {
      const designer = await DesignerModel.findById(designerId);
      if (!designer) {
        return res.status(404).json({ status: false, message: 'Designer not found' });
      }

      // Find existing booked slot for this user
      const slotIndex = designer.slots_booked.findIndex(
        (slot) =>
          slot.userId.toString() === userId.toString() &&
          slot.status === 'booked'
      );

      if (slotIndex !== -1) {
        // Update only date and time
        designer.slots_booked[slotIndex].date = slotDate;
        designer.slots_booked[slotIndex].time = slotTime;
        designer.slots_booked[slotIndex].purpose =purpose;

        designer.markModified('slots_booked');
        await designer.save();

        return res.status(200).json({
          status: true,
          message: 'Slot date and time updated successfully',
          updatedSlot: designer.slots_booked[slotIndex],
        });
      } else {
        // No slot found for this user
        return res.status(404).json({
          status: false,
          message: 'Booked slot not found for this user',
        });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async allAppointment(req, res) {
    try {
      //console.log(req.body);
      const appointment = await appointmentModel.find()

      return res.status(200).json({
        status: true,
        message: "get all appointment successfully",
        total: appointment.length,
        data: appointment
      })

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message
      })
    }
  }


}

module.exports = new BookappointmentApiController();
