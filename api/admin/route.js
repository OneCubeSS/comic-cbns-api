const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Admin = require("./admin");
const bcrypt = require("bcryptjs");

router.get("/getAdmins", async function (req, res) {
    try {
      const result = await Admin.find();
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

router.post("/updatepassword", async (req, res) => {
  let admin;
  try {
    if (req.body["username"]) {
      admin = await Admin.find({ name: req.body.name });
    } else if (req.body["email"]) {
      admin = await Admin.find({ email: req.body.email });
    }

    if (admin.length > 0) {
      const password = generator.generate({
        length: 10,
        numbers: true,
      });

      console.log("new pwd", password);

      //Hash new Password
      const salt = await bcrypt.genSalt(10);
      let cryptPwd;
      if (req.body["password"]) {
        cryptPwd = await bcrypt.hash(req.body.password, salt);
      } else {
        cryptPwd = await bcrypt.hash(password, salt);
      }

      console.log("new admin", admin[0]);
      const updatepwd = await Admin.updateOne(
        { _id: admin[0].id },
        { $set: { password: cryptPwd } }
      );
      return res.json({
        success: true,
        data: updatepwd,
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "Error",
    });
  }
});

router.post("/signup", async (req, res) => {
  console.log("request signup", req.body);
  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const cryptPwd = await bcrypt.hash(req.body.password, salt);

  const newAdmin = new Admin({
    username: req.body.username,
    email: req.body.email,
    password: cryptPwd,
  });

  try {
    const saveAdmin = await newAdmin.save();
    return res.json({
      success: true,
      data: saveAdmin,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Error",
    });
  }
});

router.post("/login", async (req, res) => {
  //Check email exists
  let admin;
  try {
    if (req.body["email"]) {
      admin = await Admin.find({ email: req.body.email });
    }
    
    //check admin
    if (!admin.length > 0) {
      return res.json({
        success: false,
        message: "Email or Password is invalid",
      });
    }

    //check pwd is correct
    const validPwd = await bcrypt.compare(req.body.password, admin[0].password);
    if (!validPwd) {
      return res.json({
        success: false,
        message: "Email or Password is invalid",
      });
    }

    //Create and assign Login Token
    const token = jwt.sign({ _id: admin[0]._id }, process.env.TOKEN_SEC);
    res.header("auth-token", token).json({
      success: true,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
});

module.exports = router;
