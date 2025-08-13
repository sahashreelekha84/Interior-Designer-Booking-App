const express=require('express')
const path=require('path')
const ejs=require("ejs")
const cors=require("cors")
const dbcon=require('./app/config/dbcon')
const startTrialExpiryCron = require('./app/config/corn'); 
startTrialExpiryCron();
const dotenv=require('dotenv').config()
console.log(process.env.my_email, process.env.my_password);
dbcon()
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

const app=express()

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use(cookieParser());
app.use(flash());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.set('view engine','ejs')
app.set('views','views')
app.use(express.static(path.join(__dirname,'/public')))
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
const designroute=require('./app/routes/api/Designroute')
app.use('/api',designroute)
const designerroute=require('./app/routes/admin/Designerroute')
app.use(designerroute)

const bannerroute=require('./app/routes/admin/bannerroute')
app.use(bannerroute)
const homeroute=require('./app/routes/admin/homeroute')
app.use(homeroute)
const authadminrouter=require('./app/routes/admin/authrouter')
app.use(authadminrouter)
const designerapiroute=require('./app/routes/api/seller/Designerapiroute')
app.use('/api',designerapiroute)

const bookingroute=require('./app/routes/api/user/booking_appointment_api_route')
app.use('/api',bookingroute)
const authroute=require('./app/routes/api/user/authapi')
app.use('/api',authroute)


port=3005
app.listen(port,()=>{
    console.log(`server running on ${port}`);
    
})