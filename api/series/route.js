const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Volume = require("./volume");
var multer = require('multer');
var fs = require('fs');
const { aggregate } = require("../comic/book");

//multer disk storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/media/series/')
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

router.get("/getseries/:id", async function (req, res) {
    try {
      const result = await Volume.find({"_id": req.params.id}).populate("publisher");

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
        message: err
      });
  } 
});

router.get("/getallseries", async function (req, res) {
  try {
    const result = await Volume.find().populate("publisher");
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
      message: err,
    });
} 
});

router.get("/getSeriesByPublisher/:id", async function (req, res) {
  try {
    const id = req.params.id;   
    const result = await Volume.find().
      populate({ path: 'publisher', _id: { $eq: id }, select: 'title' }).
      exec();
      
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
      message: err,
    });
} 
});

router.post("/addseries", upload.single('covermedia'), async function (req, res) {
    try {
      req.body.covermedia = 'public/media/series/' + req.file.filename;
      const save = await Volume.create(req.body);
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
  
  router.put("/updateseries/:id", upload.single('covermedia'), async function (req, res) {
    try {
      const result = await Volume.find({'_id': req.params.id});
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
        req.body.covermedia = 'public/media/series/' + req.file.filename;
      }
  
       const saveData = await Volume.findByIdAndUpdate(req.params.id, req.body);
        return res.json({
          success: true,
          data: saveData,
        });
  
    } catch (err) {
      return res.json({
        success: false,
        message: "Error",
      });
    }
  });

  router.delete("/deleteseries/:id", async function (req, res) {
    try {
      const result = await Volume.find({'_id': req.params.id});
      if (result.length > 0) {   
        const remove = await Volume.findByIdAndRemove(req.params.id, req.body); 
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