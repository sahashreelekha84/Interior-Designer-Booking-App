const mongoose = require('mongoose')
const Schema = mongoose.Schema



const DesignSchema = new Schema({


  decoration_budget: {
    homeType: [String],
    budget: [String],
    preferences: {
      bedroom: [String],
      kitchen: [String],
      livingroom: [String]
    }
  },
  
  isDeleted: {
    type: Boolean,
    default: false
  },
},


  { timestamps: true })
// StudentSchema.plugin(softDeletePlugin);
const Design = mongoose.model('Design', DesignSchema)
module.exports = Design