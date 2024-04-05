//auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth =(req, res, next)=>{
    try{
        console.log("cookie", req.cookies.token);
        console.log("body", req.body.token);
        //extract jwt token
        const token = req.cookies.token || req.body.token ||  req.header("Authorization").replace("Bearer ", "");  // other ways to fetch token
        if(!token || token === undefined){
            return res.status(401).json({
                success: false,
                message: "Token Missing",
            })
        }
        //verify the token : uske liye jwt m verify method avialbale h
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);

            req.user = payload;  //payload ko store kr liya h req.user m. Isme key pdi h role naam ki
        } catch(error){
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            })
        }
        next();

    } catch(error){
        return res.status(401).json({
            success: false,
            message:"something went wrong while verifying the token",
        })
    }
}



exports.isStudent = (req, res, next)=>{
    try{
        if(req.user.role !== "Student"){  //role verify
            return res.status(401).json({
                success: false,
                message: "This is a protected route for student",
            });
        } 
        next();

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User role is not matching",
        });
    }
}

exports.isAdmin = (req, res, next)=>{
    try{
        if(req.user.role !== "Admin"){  //role verify
            return res.status(401).json({
                success: false,
                message: "This is a protected route for admin",
            });
        } 
        next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User role is not matching",
        });
    }
}

