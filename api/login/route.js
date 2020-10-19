const router = require("express").Router();
const User = require("./user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/getuser", async (req, res) => {
  const user = await User.find();
  if (user.length > 0) {
    return res.json({
      success: true,
      data: user,
    });
  } else {
    return res.json({
      success: false,
      data: "No Data Found",
    });
  }
});

router.get("/getuser/:username", async (req, res) => {
    const user = await User.find({"username" : req.params.username});
    if (user.length > 0) {
      return res.json({
        success: true,
        data: user,
      });
    } else {
      return res.json({
        success: false,
        data: "No Data Found",
      });
    }
  });

  router.get("/getuser/:email", async (req, res) => {
    const user = await User.find({"email" : req.params.email});
    if (user.length > 0) {
      return res.json({
        success: true,
        data: user,
      });
    } else {
      return res.json({
        success: false,
        data: "No Data Found",
      });
    }
  });

router.post("/updatepassword", async (req, res) => {
  let user;
  try {
    if (req.body["username"]) {
      user = await User.find({ name: req.body.name });
    } else if (req.body["email"]) {
      user = await User.find({ email: req.body.email });
    }

    if (user.length > 0) {
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

      console.log("new user", user[0]);
      const updatepwd = await User.updateOne(
        { _id: user[0].id },
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

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: cryptPwd,
  });

  try {
    const saveUser = await newUser.save();
    return res.json({
      success: true,
      data: saveUser,
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
  let user;
  try {
    if (req.body["email"]) {
      user = await User.find({ email: req.body.email });
    }

    //check user
    if (!user.length > 0) {
      return res.json({
        success: false,
        message: "Email or Password is invalid",
      });
    }

    //check pwd is correct
    const validPwd = await bcrypt.compare(req.body.password, user[0].password);
    if (!validPwd) {
      return res.json({
        success: false,
        message: "Email or Password is invalid",
      });
    }

    //Create and assign Login Token
    const token = jwt.sign({ _id: user[0]._id }, process.env.TOKEN_SEC);
    res.header("auth-token", token).json({
      success: true,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

module.exports = router;
