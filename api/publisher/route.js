const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Publisher = require("./publisher");
var multer = require('multer');
var fs = require('fs');

//multer disk storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/media/publishers/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
// filter
const fileFilter=(req, file, cb)=>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//middleware file upload, size limit[5MB], filter
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/getpublisher/:id", async function (req, res) {
    try {
      const result = await Publisher.find({"_id": req.params.id});
      if (result.length > 0) {
        return res.json({
          success: true,
          data: result[0],
        });
      } else {
        return res.json({
          success: false,
          data: "No Data Found",
        });
      }
    } catch (err) {
      return res.json({
        success: false,
        message: "Error",
      });
  } 
});

router.get("/getpublishers", async function (req, res) {
  try {
    const result = await Publisher.find();
    if (result.length > 0) {
      return res.json({
        success: true,
        data: result,
      });
    } else {
      return res.json({
        success: false,
        data: "No Data Found",
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "Error",
    });
} 
});

router.post("/addpublisher", upload.single('covermedia'), async function (req, res) {
    try {
      console.log("request file: ", req.file);
      req.body.covermedia = 'public/media/publishers/' + req.file.filename;
      console.log("request body: ", req.body);
      const save = await Publisher.create(req.body);
      return res.json({
        success: true,
        data: save,
      });
    } catch (err) {
      return res.json({
        success: false,
        message: "Error",
      });
    }
  });
  
  router.put("/updatepublisher/:id", upload.single('covermedia'), async function (req, res) {
    try {
      const result = await Publisher.find({'_id': req.params.id});
      if(result.length > 0 && req.file) {
        if (result.length > 0) {
          //unlink the image and delete file named in result
          fs.unlink(result[0].covermedia, function (err) {
            if (err) {
              console.log('Cannot delete: ', result[0].covermedia);
            }
            // if no error, file has been deleted successfully
            console.log('File deleted!');
          }); 
        } 
      }
  
      if(req.file) {
        req.body.covermedia = 'public/media/publishers/' + req.file.filename;
      }
  
       const savePub = await Publisher.findByIdAndUpdate(req.params.id, req.body);
        return res.json({
          success: true,
          data: savePub,
        });
  
    } catch (err) {
      return res.json({
        success: false,
        message: "Error",
      });
    }
  });

  router.delete("/deletepublisher/:id", async function (req, res) {
    try {
      const result = await Publisher.find({'_id': req.params.id});
      if (result.length > 0) {   
        const remove = await Publisher.findByIdAndRemove(req.params.id, req.body); 
        //unlink the image and delete file named in result
        fs.unlink(result[0].covermedia, function (err) {
          if (err) {
            console.log('Cannot delete: ', result[0].covermedia);
          }
          // if no error, file has been deleted successfully
          console.log('File deleted!');
        }); 
        return res.json({
          success: true,
          data: remove,
        });
      }
      return res.json({
        success: false,
        data: result,
      });
    } catch (err) {
      return res.json({
        success: false,
        message: err,
      });
    }
  });

  getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(" ");
      if (parted.length === 2) {
        return jwt.verify(parted[1], process.env.TOKEN_SEC);
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  
  module.exports = router;