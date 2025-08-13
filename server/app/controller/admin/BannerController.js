
const BannerModel = require('../../model/bannermodel')
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
class BannerController {

    async createbanner(req, res) {
        console.log(req.body);
        console.log(req.file);

        try {
            //console.log(req.body);
            const { title, subtitle } = req.body


            const sdata = new BannerModel({
                title, subtitle
            })
            if (req.file) {
                sdata.image = req.file.path
            }
            const data = await sdata.save()
            if (data) {
                res.redirect('/')
            } else {
                res.redirect('/add')
            }
        } catch (error) {
            console.log(error);


        }


    }

    async edit(req, res) {
        try {
            const id = req.params.id
            const editdata = await BannerModel.findById(id)
            res.render('banner/edit', {
                title: "edit page",
                data: editdata
            })

        } catch (error) {
            console.log(error);


        }

    }



async  update(req, res) {
  try {
    const id = req.params.id;

    // Fetch the existing banner document
    const existingBanner = await BannerModel.findById(id);
    if (!existingBanner) {
      return res.status(404).json({
        status: false,
        message: "Banner not found",
      });
    }

    let updateData = { ...req.body };

    // If a new image is uploaded
    if (req.file) {
      // Delete the old image file if it exists
      if (existingBanner.image) {
        const oldImagePath = path.join(__dirname, '..', '..', "..", existingBanner.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Old image deleted successfully.");
          }
        });
      }

      // Update the image path in the update data
      updateData.image = req.file.path;
      console.log("New image uploaded and path added:", req.file.path);
    }

    // Update the banner document
    const updatedBanner = await BannerModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBanner) {
      return res.status(404).json({
        status: false,
        message: "Banner not found",
      });
    }

    res.redirect('/banner/list');
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}


    async delete(req, res) {
        console.log(req.body);

        try {
            const id = req.params.id

            const updatedata = await BannerModel.findByIdAndUpdate(id, { isDeleted: true })
            if (!updatedata) {
                return res.status(404).json({
                    status: false,
                    message: "banner not found",
                });
            }

            if (updatedata.image) {

                const absolutePath = path.join(__dirname, '..', '..', "..", updatedata.image);
                console.log("__dirname to delete:", __dirname);
                console.log("Attempting to delete:", absolutePath);

                if (fsSync.existsSync(absolutePath)) {
                    await fs.unlink(absolutePath);
                    console.log(absolutePath);

                    console.log("File deleted:", absolutePath);
                } else {
                    console.log("File not found:", absolutePath);
                }
            }

            res.redirect('/')


        } catch (error) {
            console.log(error);
            console.error('Error deleting file:', err);
        }

    }
}
module.exports = new BannerController()