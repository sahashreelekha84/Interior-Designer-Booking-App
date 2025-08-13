// const ErrorCode = require("../../helper/httpsServerCode");

const DesignerModel = require('../../model/Designermodel')
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const contactModel = require('../../model/contactmodel');
class DesignerController {

    async createDesigner(req, res) {
        console.log(req.body);
        console.log(req.file);

        try {
            //console.log(req.body);
            const { name,
                location,
                rating,
                style,
                projects, hometype, budget, kitchen, bathroom, bedroom, livingroom } = req.body


            const sdata = new DesignerModel({
                name,
                location,
                rating,
                style,
                projects,
                decoration_budget: {
                    hometype: {
                        hometype: hometype
                    },
                    budget: {
                        budget: budget
                    },
                    preferences: {
                        bedroom: {
                            bedroom: bedroom
                        },
                        bathroom: {
                            bathroom: bathroom
                        },
                        kitchen: {
                            kitchen: kitchen
                        },
                        livingRoom: {
                            livingRoom: livingroom
                        }
                    }
                }
            })
            if (req.file) {
                sdata.image = req.file.path
            }
            const data = await sdata.save()
            if (data) {
                res.redirect('/Designer/list')
            } else {
                res.redirect('/add')
            }
        } catch (error) {
            console.log(error);


        }


    }
    async listDesigner(req, res) {
        try {
            const data = await DesignerModel.find({ isDeleted: false });


            res.render('Designer/list',
                {
                    title: "Designer List",
                    data: data
                });
        } catch (error) {
            res.redirect('/Designer/list', { message: error.message })
        }
    }
    async addPageDesigner(req, res) {

        try {
            res.render('Designer/add', {
                title: "Designer add",
                data: req.user
            });
        } catch (error) {
            res.redirect('/Designer/add', { message: error.message })
        }
    }
    async edit(req, res) {
        try {
            const id = req.params.id
            const editdata = await DesignerModel.findById(id)
            res.render('Designer/edit', {
                title: "edit page",
                data: editdata
            })

        } catch (error) {
            console.log(error);


        }

    }



    async update(req, res) {
        try {
            const id = req.params.id;

            // Fetch the existing Designer document
            const existingDesigner = await DesignerModel.findById(id);
            if (!existingDesigner) {
                return res.redirect('/')
            }

            let updateData = { ...req.body };

            // If a new image is uploaded
            if (req.file) {
                // Delete the old image file if it exists
                if (existingDesigner.image) {
                    const oldImagePath = path.join(__dirname, '..', '..', "..", existingDesigner.image);
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

            // Update the Designer document
            const updatedDesigner = await DesignerModel.findByIdAndUpdate(id, updateData, {
                new: true,
            });

            if (!updatedDesigner) {
                res.redirect('/')
            }

            res.redirect('/Designer/list');
        } catch (error) {
            console.error("Update error:", error);
            res.redirect('/')
        }
    }
    async viewDesignerList(req, res) {
        try {
            const { status } = req.query; // 'active', 'inactive' or undefined
            let query = {};

            if (status === 'active') query.isActive = true;
            else if (status === 'inactive') query.isActive = false;

            const designers = await DesignerModel.find(query);

            res.render('Designer/list', {
                designers,
                selectedStatus: status || 'all', // for EJS select dropdown
            });
        } catch (err) {
            console.error(err);
            res.redirect('/admin/dashboard');
        }
    }
    async toggleDesignerStatus(req, res) {
        try {
            const  id  = req.params.id;
            const designer = await DesignerModel.findById(id);

            if (!designer) {
                req.flash('error', 'Designer not found');
                return res.redirect('/Designer/list');
            }

            designer.isActive = !designer.isActive;
            await designer.save();

            req.flash('success', `Designer ${designer.isActive ? 'activated' : 'deactivated'} successfully.`);
            res.redirect('/Designer/list');
        } catch (err) {
            console.log(err);
            req.flash('error', 'Something went wrong');
            res.redirect('/Designer/list');
        }
    }

    async delete(req, res) {
        console.log(req.body);

        try {
            const id = req.params.id
             console.log(id);
             
            const updatedata = await DesignerModel.findByIdAndUpdate(id, { isDeleted: true })
            if (!updatedata) {
                res.redirect('/')
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
    async getallsms(req, res) {
        try {
            const data = await contactModel.find({ is_deleted: false });


            res.render('contact/list',
                {
                    title: "contact List",
                    data: data
                });
        } catch (error) {
            res.redirect('/contact/list', { message: error.message })
        }


    }
}
module.exports = new DesignerController()