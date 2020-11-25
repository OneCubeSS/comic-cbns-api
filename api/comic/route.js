const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Book = require("./book");
const Variant = require("./variant");
const Category = require("./category");
var multer = require('multer');
var fs = require('fs');

//multer disk storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/media/issues/')
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
      const result = await Book.find().populate('publisher').populate('series');

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

router.get("/getbooks/:page", async function (req, res) {
  try {
    const result = await Book.find().skip(req.params.page*100).limit(100).populate('publisher').populate('series');
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

router.get("/getbooks/:pub_id", async function (req, res) {
  try {
    const result = await Book.find({ "publisher": req.params.pub_id }).populate('publisher').populate('series');
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
      const result = await Book.find({"_id": req.params.id}).populate('publisher').populate('series');
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

router.get("/getBooksBySeries/:id", async function (req, res) {
  try {
    const id = req.params.id; 
    const result = await Book.find().
      populate({ path: 'series', _id: { $eq: id }, select: 'title' }).
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

// Check book exists

//use file upload middleware multer
router.post("/addbook", upload.single('covermedia'), async function (req, res) {
    try {
      //req.body.covermedia = req.file.path;
      req.body.covermedia = 'public/media/issues/' + req.file.filename;
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

router.put("/updatebook/:id", upload.single('covermedia'), async function (req, res) {
  try {
    const result = await Book.find({'_id': req.params.id});
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
      req.body.covermedia = 'public/media/issues/' + req.file.filename;
    }

     const saveBook = await Book.findByIdAndUpdate(req.params.id, req.body);
      return res.json({
        success: true,
        data: saveBook,
      });

  } catch (err) {
    return res.json({
      success: false,
      message: "Error",
    });
  }
});

router.delete("/deletebook/:id", async function (req, res) {
  try {
    const result = await Book.find({'_id': req.params.id});
    if (result.length > 0) {   
      const remove = await Book.findByIdAndRemove(req.params.id, req.body); 
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

// router.get("/getvariants", async function (req, res) {
//   try {
//     const result = await Variant.find();
//     if (result.length > 0) {
//       return res.json({
//         success: true,
//         data: result,
//       });
//     } else {
//       return res.json({
//         success: false,
//         data: "No Data Found",
//       });
//     }
//   } catch (err) {
//     return res.json({
//       success: false,
//       message: "Error",
//     });
// } 
// });

// router.get("/getvariant/:id", async function (req, res) {
//   try {
//     const result = await Book.find({"_id": req.params.id});
//     if (result.length > 0) {
//       return res.json({
//         success: true,
//         data: result[0],
//       });
//     } else {
//       return res.json({
//         success: false,
//         data: "No Data Found",
//       });
//     }
//   } catch (err) {
//     return res.json({
//       success: false,
//       message: "Error",
//     });
// } 
// });

// router.get("/getvariants/:page", async function (req, res) {
//   try {
//     const result = await Variant.find().skip(req.params.page*100).limit(100);
//     if (result.length > 0) {
//       return res.json({
//         success: true,
//         data: result,
//       });
//     } else {
//       return res.json({
//         success: false,
//         data: "No Data Found",
//       });
//     }
//   } catch (err) {
//     return res.json({
//       success: false,
//       message: "Error",
//     });
// } 
// });

// router.post("/addvariant", upload.single('covermedia'), async function (req, res) {
//     try {
//       //req.body.covermedia = req.file.path;
//       req.body.covermedia = 'public/media' + req.file.filename;
//       const save = await Variant.create(req.body);
//       return res.json({
//         success: true,
//         data: save,
//       });
//     } catch (err) {
//       return res.json({
//         success: false,
//         message: "Error",
//       });
//     }
// });

// router.get("/getcat/:id", async function (req, res) {
//   try {
//     const result = await Category.find({"_id": req.params.id});
//     if (result.length > 0) {
//       return res.json({
//         success: true,
//         data: result[0],
//       });
//     } else {
//       return res.json({
//         success: false,
//         data: "No Data Found",
//       });
//     }
//   } catch (err) {
//     return res.json({
//       success: false,
//       message: "Error",
//     });
// } 
// });

// router.get("/getcats", async function (req, res) {
// try {
//   const result = await Category.find();
//   if (result.length > 0) {
//     return res.json({
//       success: true,
//       data: result,
//     });
//   } else {
//     return res.json({
//       success: false,
//       data: "No Data Found",
//     });
//   }
// } catch (err) {
//   return res.json({
//     success: false,
//     message: "Error",
//   });
// } 
// });

// router.post("/addcategory", upload.single('covermedia'), async function (req, res) {
//   try {
//     req.body.covermedia = 'public/media' + req.file.filename;
//     const save = await Category.create(req.body);
//     return res.json({
//       success: true,
//       data: save,
//     });
//   } catch (err) {
//     return res.json({
//       success: false,
//       message: "Error",
//     });
//   }
// });

// router.put("/updatecat/:id", upload.single('covermedia'), async function (req, res) {
//   try {
//     const result = await Category.find({'_id': req.params.id});
//     if(result.length > 0 && req.file) {
//       if (result.length > 0) {
//         //unlink the image and delete file named in result
//         fs.unlink(result[0].covermedia, function (err) {
//           if (err) {
//             console.log('Cannot delete: ', result[0].covermedia);
//           }
//           // if no error, file has been deleted successfully
//           console.log('File deleted!');
//         }); 
//       } 
//     }

//     if(req.file) {
//       req.body.covermedia = 'public/media/' + req.file.filename;
//     }

//      const saveCat = await Category.findByIdAndUpdate(req.params.id, req.body);
//       return res.json({
//         success: true,
//         data: saveCat,
//       });

//   } catch (err) {
//     return res.json({
//       success: false,
//       message: "Error",
//     });
//   }
// }); 

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
