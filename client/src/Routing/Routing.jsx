import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile'
import MyConsultations from '../pages/MyConsultations'
import Footer from '../layouts/Footer';
import PortfolioSection from '../features/designerProfile/Portfoliosection';
import DesignerRegisterPage from '../Auth/Designer/Register';
import Contact from '../features/home/Contact';
import Aboutus from '../features/home/About';
import DesignSuggestions from '../features/home/Designersuggesion';

import Designerdashbord from '../Auth/Designer/Dashboard/Designerdashbord';
import Designerdashboardprofile from '../Auth/Designer/Dashboard/Designerdashboardprofile';
import DesignerAppoinment from '../Auth/Designer/Dashboard/DesignerAppoinment';
import Uploadportfolio from '../Auth/Designer/Dashboard/Uploadportfolio';
import Register from '../Auth/user/Register';
import Login from '../Auth/user/Login';
import DesignerLogin from '../Auth/Designer/Login';
import UserDashboard from '../Auth/user/Dashboard/Dashboard';
import Userdashboardprofile from '../Auth/user/Dashboard/Userprofile';
import Header from '../layouts/Header';
import UpgradeSubscription from '../Auth/Designer/Dashboard/Upgradesubscription';
import ForgotPassword from '../Auth/user/Forgotpassword';
import ResetPassword from '../Auth/user/Reset';

const Routing = () => {
  return (
    <div>
      <Router>
        <Header/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/designer/dashboard" element={<Designerdashbord/>}/>
      <Route path="/designer/profile" element={<Designerdashboardprofile/>}/>
      <Route path="/designer/bookingappointment"element={<DesignerAppoinment/>}/>
      <Route path="/designer/uploads" element={<Uploadportfolio/>}/>
      <Route path="/designer/:_id" element={<Profile />} />
      <Route path="user/consultations" element={<MyConsultations />} />
      <Route path="/design" element={<PortfolioSection/>} />
      <Route path="/designer_register" element={<DesignerRegisterPage/>} />
      <Route path='/designer_login'element={<DesignerLogin/>}/>
      <Route path='/user/register' element={<Register/>}/>
      <Route path='/user/login'element={<Login/>}/>
      <Route path='/user/forgetpassword'element={<ForgotPassword/>}/>
       <Route path='/user/restpassword/:token'element={<ResetPassword/>}/>
      <Route path='/user/dashboard' element={<UserDashboard/>}/>
      <Route path='/user/profile' element={<Userdashboardprofile/>}/>
      <Route path="/contact" element={<Contact/>} />
      <Route path="/about" element={<Aboutus/>} />
      <Route path='/designer/upgrade_subscription'element={<UpgradeSubscription/>}/>
      <Route path="/design-suggestions" element={<DesignSuggestions/>} />
    </Routes>
    <Footer/>
  </Router>
    </div>
  )
}

export default Routing
