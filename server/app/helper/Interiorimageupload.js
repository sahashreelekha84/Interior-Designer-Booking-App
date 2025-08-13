// middleware/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dynamic storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const category = req.body.category;


        cb(null, `./uploads/${category}`);
    },
    filename: (req, file, cb) => {

        cb(null, Date.now() + '-' + file.originalname);
    }
});

const Interiorimageupload = multer({ storage });

module.exports = Interiorimageupload;
