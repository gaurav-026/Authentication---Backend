const express = require("express");
const router = express.Router();

const {login, signup} = require("../controllers/auth");
const {auth, isStudent, isAdmin} = require("../middlewares/middleware");

router.post("/login", login);
router.post('/signup', signup);

router.get("/test", auth, (req, res)=>{
    res.json({
        success: true,
        message: "Welcome to the protected route for Test",
    })
})
//protected route
router.get("/student", auth, isStudent, (req, res)=>{
    res.json({
        success: true,
        message: "Welcome to the projected route for students",
    })
});
router.get("/admin", auth, isAdmin, (req, res)=>{
    res.json({
        success: true,
        message: "Welcome to the projected route for admin",
    });
})
module.exports = router;
