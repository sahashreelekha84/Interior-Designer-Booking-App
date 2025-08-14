
const { hashpassword, comparepassword } = require("../../../middleware/Authcheck");
const DesignerModel = require("../../../model/Designermodel")
const jwt = require('jsonwebtoken');
const userModel = require("../../../model/usermodel");
class DesignerApiController {
    async createDesigner(req, res) {
        console.log(req.body);
        console.log(req.file);

        try {
            //console.log(req.body);
            const { designername,
                email,
                password,
                bio,
                location,
                rating,
                style,
                projects, decoration_budget: rawDecorationBudget, role } = req.body
            const hash = hashpassword(password)
            const existemail = await DesignerModel.findOne({ email })
            if (existemail) {
                return res.status(403).json({
                    status: false,
                    message: 'Email is already Exist'
                });
            }
            let decoration_budget = {};
            try {
                decoration_budget = JSON.parse(rawDecorationBudget);
            } catch (parseError) {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid JSON in decoration_budget'
                });
            }

            const sdata = new DesignerModel({
                designername,
                email,
                bio,
                password: hash,
                location,
                rating,
                style,
                projects,
                decoration_budget, role
            })
            if (req.file) {
                sdata.image = req.file.path
            }
            const data = await sdata.save()
            return res.status(201).json({
                status: true,
                message: "Designer register successfully",

                data: data
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            })
        }


    }

    async login(req, res) {
        const { email, password } = req.body

        try {
            if (!email || !password) {
                return res.status(400).json({
                    status: false,
                    message: error.message
                })
            }
            const user = await DesignerModel.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'Designer not found'
                })
            }
            const ismatch = comparepassword(password, user.password)
            if (!ismatch) {
                res.status(400).json({
                    status: false,
                    message: 'invalid password'
                })
            }
            const totalAppointments = user.slots_booked.length;
            const bookedCount = user.slots_booked.filter(slot => slot.status === 'booked').length;
            const uniqueClientIds = new Set(user.slots_booked.map(slot => slot.userId?.toString()));
            const totalClients = uniqueClientIds.size;

            user.totalSlots = totalAppointments;
            user.bookedCount = bookedCount;
            user.totalClients = totalClients;
            await user.save();
            const token = jwt.sign({
                _id: user._id,
                designername: user.designername,
                email: user.email,
                role: user.role,

                bio: user.bio,

                location: user.location,
                rating: user.rating,
                style: user.style,
                projects: user.projects,
                decoration_budget: user.decoration_budget,
                slots_booked: user.slots_booked,
                subscriptionType: user.subscriptionType,
                subscriptionStart: user.subscriptionStart,
                subscriptionEnd: user.subscriptionEnd,
                isActive: user.isActive,
                totalSlots: user.totalSlots,
                bookedCount: user.bookedCount,
                totalClients: user.totalClients

            }, process.env.JWT_SECRECT_KEY, { expiresIn: "2h" })
            return res.status(200).json({
                status: true,
                message: 'Designer login successfully',
                user: {
                    _id: user._id,
                    designername: user.designername,
                    email: user.email,
                    role: user.role,

                    bio: user.bio,

                    location: user.location,
                    rating: user.rating,
                    style: user.style,
                    projects: user.projects,
                    decoration_budget: user.decoration_budget,
                    slots_booked: user.slots_booked,
                    subscriptionType: user.subscriptionType,
                    subscriptionStart: user.subscriptionStart,
                    subscriptionEnd: user.subscriptionEnd,
                    isActive: user.isActive,
                    totalSlots: user.totalSlots,
                    bookedCount: user.bookedCount,
                    totalClients: user.totalClients

                },
                token: token
            })
        }
        catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message
            })
        }

    }
    async Designerlist(req, res) {
        try {
            //console.log(req.body);
            const Designer = await DesignerModel.find({ isDeleted: false, isActive: true })

            return res.status(200).json({
                status: true,
                message: "get all Designer successfully",
                total: Designer.length,
                data: Designer
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            })
        }
    }
    async editdesigner(req, res) {
        try {
            const id = req.params.id
            const editdata = await DesignerModel.findById(id)
            return res.status(200).json({
                status: true,
                message: "get single Designer successfully",

                data: editdata
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            })
        }

    }
    async designerDashboard(req, res) {
        console.log(req.user);
        const designerId = req.user._id;
        const totalClients = req.user.totalClients
        const bookedCount = req.user.bookedCount
        const designer = await DesignerModel.findById(designerId).select(
            '-password -__v'
        );
        console.log(designer.totalClients);

        if (!designer) {
            return res.status(404).json({
                status: false,
                message: 'Designer not found'
            });
        }
        const totalDesigners = await DesignerModel.countDocuments();
        const activeDesigners = await DesignerModel.countDocuments({ isActive: true });
        const inactiveDesigners = await DesignerModel.countDocuments({ isActive: false });

        // Calculate some useful stats
        const totalBookedSlots = designer.slots_booked.length;
        const upcomingSlots = designer.slots_booked.filter(slot => {
            // Filter slots with date in the future and status not cancelled/completed
            const slotDate = new Date(slot.date);
            const now = new Date();

            if (slotDate >= now) {
                
                return !['cancelled', 'completed'].includes(slot.status);
            } else {
                
                return slot.status === 'cancelled';
            }

        });
        try {
            return res.status(200).json({
                status: true,
                message: 'welcome to designer dashboard succesfully',
                data: {
                    profile: designer,
                    totalClients,
                    bookedCount,
                    totalBookedSlots,
                    upcomingSlots,
                    totalDesigners,
                    activeDesigners,
                    inactiveDesigners
                }

            });

        } catch (error) {
            console.log(error.message);

        }

    }
    async designerprofile(req, res) {
        console.log(req.user);

        try {
            return res.status(200).json({
                status: true,
                message: 'Designer profile fetched succesfully',
                data: req.user
            })

        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message
            })
        }
    }
    async review(req, res) {
        const { designerId, userId, name, rating, message, date } = req.body;

        try {
            const designer = await DesignerModel.findById(designerId);
            if (!designer) {
                return res.status(404).json({ status: false, message: 'Designer not found' });
            }

            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }


            designer.review = designer.review.filter(r => r.name && r.rating && r.message);

            const newReview = {
                name,
                userId,
                designerId,
                rating,
                message,
                date: date || new Date().toLocaleDateString(),
            };

            designer.review.push(newReview);
            designer.markModified('review');

            await designer.save();

            res.status(201).json({
                status: true,
                message: 'Review submitted successfully',
                data: newReview
            });

        } catch (error) {
            res.status(400).json({
                status: false,
                message: error.message
            });
        }
    }
    async getReviewByUserAndDesigner(req, res) {
        const { userId, designerId } = req.params;

        try {
            const review = await DesignerModel.findOne({ userId, designerId });
            if (!review) {
                return res.status(404).json({ message: 'No review found' });
            }
            return res.status(200).json({
                status: true,
                message: 'single review fetched successfully',
                data: review
            })

        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    };
    async portfolio(req, res) {
        try {
            const { designerId, title, category, createdAt } = req.body;
            console.log(req.files);


            const files = req.files;
            console.log(files);

            if (!designerId || !title || !category || !files?.length) {
                return res.status(400).json({ status: false, message: 'All fields are required' });
            }

            const designer = await DesignerModel.findById(designerId);
            if (!designer) {
                return res.status(404).json({ status: false, message: 'Designer not found' });
            }

            const imageFilenames = files.map(file => file.path);


            const newportfolio = {
                designerId,
                title,

                category,
                images: imageFilenames,
                createdAt
            };

            designer.portfolio.push(newportfolio);
            designer.markModified('portfolio');

            await designer.save();

            res.status(201).json({
                status: true,
                message: 'Portfolio created successfully',
                data: newportfolio,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    }

    async updateSubscription(req, res) {
        const { designerId, subscriptionType } = req.body;

        const durationMap = {
            '1 Month': 30,
            '3 Months': 90,
            '6 Months': 180,
            '1 Year': 365,
        };

        if (!designerId || !subscriptionType) {
            return res.status(400).json({ error: 'designerId and subscriptionType are required' });
        }

        if (!durationMap[subscriptionType]) {
            return res.status(400).json({ error: 'Invalid subscriptionType value' });
        }

        try {
            const start = new Date();
            const end = new Date(start);
            end.setDate(end.getDate() + durationMap[subscriptionType]);

            const updatedDesigner = await DesignerModel.findByIdAndUpdate(
                designerId,
                {
                    subscriptionType,
                    subscriptionStart: start,
                    subscriptionEnd: end,
                    isActive: true,
                },
                { new: true }
            );

            if (!updatedDesigner) {
                return res.status(404).json({ error: 'Designer not found' });
            }

            res.status(200).json({
                message: `Subscription updated to ${subscriptionType}`,
                designer: updatedDesigner,
            });
        } catch (err) {
            console.error('Subscription update error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    };







}
module.exports = new DesignerApiController()