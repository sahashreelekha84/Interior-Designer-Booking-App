const { hashpassword, comparepassword } = require("../../../middleware/Authcheck");
const DesignerModel = require("../../../model/Designermodel");
const userModel = require("../../../model/usermodel");
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.my_email,
        pass: process.env.my_password
    }
})
const generateotp = () => crypto.randomInt(100000, 999999).toString()
class AuthUserController {
    async register(req, res) {
        console.log(req.body);



        try {
            const { fullname, email, password, phone } = req.body
            const existinguser = await userModel.findOne({ email })
            if (existinguser) {
                return res.status(409).json({
                    status: false,
                    message: "Email is already registered",
                });
            }
            const hash = hashpassword(password)
            const otp = generateotp()
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
            console.log(otpExpiry.toString());
            const user = await new userModel({
                fullname, email, password: hash, phone,otp,otpExpiry
            })

            const data = await user.save()
            await transporter.sendMail({
                from: 'shreelekhasaha2000@gmail.com',
                to: email,
                subject: 'OTP Verification',

                text: `Your OTP is: ${otp}`,
                html: `<p>Dear ${data.fullname},</p><p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP)</p>
                       <h2>OTP: ${otp}</h2>
                       <p>This OTP is valid for 10 minutes. If you didn't request this OTP, please ignore this email.</p>`
            })
            return res.status(201).json({
                status: true,
                message: 'User registered.Please Verify OTP sent to email',
                data: data, otp,
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                status: false,
                message: error.message

            })
        }
    }
    async verifyotp(req, res) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({ message: 'Email and OTP are required' });
            }

            const user = await userModel.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            
            if (user.isVerified) {
                return res.status(400).json({ message: 'User already verified' });
            }

            if (String(user.otp) !== String(otp)) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            if (user.otpExpiry < new Date()) {
                return res.status(400).json({ message: 'OTP has expired' });
            }

            user.isVerified = true;
            user.otp = undefined;
            user.otpExpiry = undefined;

            await user.save();

            return res.status(200).json({ message: 'User verified successfully' });

        } catch (error) {
            console.error('Verify OTP error:', error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }



    async resendotp(req, res) {
        try {
            const { email } = req.body
            const user = await userModel.findOne({ email })
            if (!user)
                return res.status(400).json({
                    message: 'User not found'
                })
            if (user.isVerified)
                return res.status(400).json({
                    message: 'User already verified'
                })

            const otp = generateotp()
            user.otp = otp
            user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
            console.log("Expires at:", user.otpExpiry.toString());
            await user.save()
            await transporter.sendMail({
                from: 'shreelekhasaha2000@gmail.com',
                to: email,
                subject: 'Resend OTP Verification',
                text: `Your new OTP is: ${otp}`,
                html: `<p>Dear ${user.fullname},</p><p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP)</p>
                       <h2>OTP: ${otp}</h2>
                       <p>This OTP is valid for 10 minutes. If you didn't request this OTP, please ignore this email.</p>`

            })
            return res.status(200).json({
                message: 'OTP resent successfully.'
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message,
            });
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
            const user = await userModel.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'user not found'
                })
            }
            const ismatch = comparepassword(password, user.password)
            if (!ismatch) {
                res.status(400).json({
                    status: false,
                    message: 'invalid password'
                })
            }


            const token = jwt.sign({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,


            }, process.env.JWT_SECRECT_KEY, { expiresIn: "2h" })
            return res.status(200).json({
                status: true,
                message: 'user login successfully',
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    bookedCount: user.bookedCount,
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
    async forgetpassword(req, res) {
        try {
            const { email } = req.body;

            if (!email) return res.status(400).json({ message: 'Email is required' });

            const user = await userModel.findOne({ email });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const token = jwt.sign(
                { _id: user._id, email: user.email },
                process.env.JWT_SECRECT_KEY,
                { expiresIn: '2h' }
            );

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.my_email,
                    pass: process.env.my_password,
                },
            });

            const resetUrl = `${process.env.Client_url}/resetpassword/${token}`;

            const mailOptions = {
                from: process.env.my_email,
                to: email,
                subject: 'Reset Your Password',
                html: `<p>Click the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({
                status: true,
                token,
                message: 'Password reset link sent to your email'
            });
        } catch (error) {
            console.error('Forgot password error:', error.message);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    async resetpassword(req, res) {
        try {
            const { token } = req.params;
            const { password } = req.body;
            console.log(password);

            if (!token || !password) {
                return res.status(400).json({ message: 'Token and password required' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY);
            const user = await userModel.findOne({ email: decoded.email });

            if (!user) return res.status(404).json({ message: 'User not found' });

            const newHashedPassword = await hashpassword(password);
            user.password = newHashedPassword;
            await user.save();

            return res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            console.error('Reset password error:', error.message);
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

    }
    async userdashboard(req, res) {
        try {
            return res.status(200).json({
                status: true,
                message: 'welcome to user dashboard',
                data: req.user
            })

        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message
            })
        }
    }
    async userprofile(req, res) {
        try {
            return res.status(200).json({
                status: true,
                message: 'welcome to user profile',
                data: req.user
            })

        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message
            })
        }
    }
}
module.exports = new AuthUserController()