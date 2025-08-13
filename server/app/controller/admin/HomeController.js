

const BannerModel = require('../../model/bannermodel');



class HomeController {

    // Show all Banner
    async list(req, res) {
        try {
            const data = await BannerModel.find({ isDeleted: false });
      
            
            res.render('banner/list',
                {
                    title: "Banner List", 
                    data:data 
                });
        } catch (error) {
            res.redirect('/banner/list', { message: error.message })
        }
    }
    async addPage(req, res) {
        
        try {
            res.render('banner/add', {
                title: "Banner add",
                data:req.user
            });
        } catch (error) {
            res.redirect('/banner/add', { message: error.message })
        }
    }



}


module.exports = new HomeController()