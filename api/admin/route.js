const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Admin = require("./admin");

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

module.exports = router;
