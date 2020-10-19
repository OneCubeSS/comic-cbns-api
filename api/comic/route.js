const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Book = require("./book");
const Variant = require("./variant");
const Category = require("./category");

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

router.get("/getbook/:id", async function (req, res) {
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

router.get("/getbooks/:page", async function (req, res) {
    try {
      const result = await Book.find().skip(req.params.page*100).limit(100);;
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

router.get("/getcat/:title", async function (req, res) {
    try {
      const result = await Category.find({"title": req.params.title});
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

router.post("/addbook", async function (req, res) {
    try {
      const save = await Book.create(req.body);
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

router.post("/addvariant", async function (req, res) {
    try {
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
