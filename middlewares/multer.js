const multer = require("multer");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const dir = "./public/img/products/";
    cb(null,dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    req.fileName = uniqueSuffix+"_"+file.originalname;
    cb(null, uniqueSuffix+"_"+file.originalname);
  },
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === "image/jpg"  || 
       file.mimetype ==="image/jpeg"  || 
       file.mimetype ===  "image/png"){
     
    cb(null, true);
   }else{
    cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
}
}

module.exports = multer({
  storage: storage,
  fileFilter : fileFilter,
  limits: { fieldSize: 2 * 1024 * 1024 },
}); //maximum 2mb
