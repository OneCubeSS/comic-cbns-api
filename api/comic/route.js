const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Book = require("./book");
const Variant = require("./variant");
const Category = require("./category");
var multer = require('multer');

//multer disk storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/media/')
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

router.get("/getbooks", async function (req, res) {
    try {
      const result = await Book.find();
      console.log(result.length);
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

router.get("/getbooks/:page", async function (req, res) {
  try {
    const result = await Book.find().skip(req.params.page*100).limit(100);
    console.log(result.length);
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

router.get("/getbooks/:cat_id", async function (req, res) {
  try {
    const result = await Book.find({ "categories": cat_id });
    console.log(result.length);
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

router.get("/getbook/:id", async function (req, res) {
    try {
      const result = await Book.find({"_id": req.params.id});
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

router.get("/getvariants", async function (req, res) {
    try {
      const result = await Variant.find();
      console.log(result.length);
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

router.get("/getvariant/:id", async function (req, res) {
    try {
      const result = await Book.find({"_id": req.params.id});
      console.log(result.length);
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

router.get("/getvariants/:page", async function (req, res) {
    try {
      const result = await Variant.find().skip(req.params.page*100).limit(100);
      console.log(result.length);
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

router.get("/getcat/:name", async function (req, res) {
    try {
      const result = await Category.find({"name": req.params.name});
      console.log(result.length);
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

router.get("/getcats", async function (req, res) {
  try {
    const result = await Category.find();
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

// Check book exists
// Check varient exists
// Check category exists

//use file upload middleware multer
router.post("/addbook", upload.single('covermedia'), async function (req, res) {
    try {
      //req.body.covermedia = req.file.path;
      req.body.covermedia = '/public/media/' + req.file.filename;
      const save = await Book.create(req.body);
      return res.json({
        success: true,
        data: save,
      });
    } catch (err) {
      return res.json({
        success: false,
        message: err,
      });
    }
});

router.post("/addvariant", upload.single('covermedia'), async function (req, res) {
    try {
      //req.body.covermedia = req.file.path;
      req.body.covermedia = '/public/media/' + req.file.filename;
      const save = await Variant.create(req.body);
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

router.post("/addcategory", upload.single('covermedia'), async function (req, res) {
  try {
    req.body.covermedia = '/public/media/' + req.file.filename;
    const save = await Category.create(req.body);
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
