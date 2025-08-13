// const ErrorCode = require("../../helper/httpsServerCode");

const DesignModel = require('../../../model/Designmodel')
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
class DesignApiController {

    async createDesign(req, res) {
        console.log(req.body);


        try {
            //console.log(req.body);
            const { designername,
                location,
                rating,
                style,
                projects, decoration_budget } = req.body


            const sdata = new DesignModel({
                designername,
                location,
                rating,
                style,
                projects,
                decoration_budget


            })

            const data = await sdata.save()
            return res.status(201).json({
                status: true,
                message: "Design fetched successfully",

                data: data
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            })


        }
    }
    async listDesign(req, res) {
        try {
            const Design = await DesignModel.find({ isDeleted: false });


             return res.status(200).json({
                status: true,
                message: "get all Design successfully",
                total: Design.length,
                data: Design
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            })
        }
    }
   
}
module.exports = new DesignApiController()