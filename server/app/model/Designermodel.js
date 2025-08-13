const mongoose = require('mongoose')
const Schema = mongoose.Schema



const DesignerSchema = new Schema({

  designername: {
    type: String,
    require: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
 
  },
  style: {
    type: String,
    required: true,
  },
  projects: {
    type: String,
    
  },
  available: {
    type: Boolean,
    default: true
  },
  slots_booked: {
    type: [
      {
        date: String,
        time: String,
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'user'
        },
        designerId: {
          type: Schema.Types.ObjectId,
          ref: 'Designer'
        },
        designername: String,
        user: String,
        phone:String,
        email:String,
        totalBookedSlots: Number,
        status: {
          type: String,
          enum: ['booked', 'cancelled', 'completed', 'available', 'confirmed'],
          default: 'booked'
        },purpose:String
      }
    ],
    default: []
  },
  decoration_budget: {
    homeType: [String],
    budget: [String],
    preferences: {
      bedroom: [String],
      kitchen: [String],
      livingroom: [String]
    }
  },
  image: {
    type: String,
    require: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,

    enum: ['admin', 'Designer', 'user'],
    default: "Designer"
  },
  review: {
    type: [
      {
        designerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Designer',
          required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        message: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          default: () => new Date().toLocaleDateString(),
        }
      }

    ]
  },
  portfolio: {
    type: [
      {
        designerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Designer',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  images: [String], // Array of image file names

  category: {
    type: String,
    enum: ['Interior', 'Furniture', 'Paint'], // Your 3 categories
    required: true,
  },

  description: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
      }    ]
  },
subscriptionType: {
  type: String,
  enum: ['Trial', '1 Month', '3 Months', '6 Months', '1 Year'],
  default: 'Trial',
},
subscriptionStart: {
  type: Date,
  default: Date.now,
},
subscriptionEnd: {
  type: Date,
},
isActive: {
  type: Boolean,
  default: false,
},

},


  { timestamps: true })
// StudentSchema.plugin(softDeletePlugin);
const DesignerModel = mongoose.model('Designer', DesignerSchema)
module.exports = DesignerModel