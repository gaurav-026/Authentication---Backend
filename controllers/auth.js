//password ko hash krane ke liye library chahiye bcrypt
const bcrypt = require("bcrypt");


const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//signup route handler
exports.signup = async (req, res)=>{
    try{
        //fetch the data;
        const {name, email, password, role} = req.body;
        //check if user already exist : DB Call krni pdegi iske liye to
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(500).json({
                success: false,
                message: "User already exist",
            });
        }

        //secure password
        let hashedPassword;
        try{
            //hash function ka use krke password hash krenge. Hash function 2 arguments leta h mainly ..first kya encrypt krna h aur second kitne rounds m krna h 
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(error){
            return res.status(500).json({
                success: false,
                message: "Error in hashing pasword",
            })
        }

        //create entry for user
        const user = await User.create({name, email, password:hashedPassword, role});
        return res.status(200).json({
            success: true,
            message: "User created Successfully",
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registerred this time. Please try again later",
        });
    }
}


exports.login = async(req, res)=>{
    try{
        //fetch email and passwrod
        const {email, password} = req.body;
        //validate email and password
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            })
        }

        //check email db se match h ya nhi 
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered. Sign up first!",
            })
        }

        //verify password and generate jwt token
        //jwt ke liye payload, secret, option ye sab pass krne h to uske liye
        const payload = {
            email: user.email,
             id: user._id,
              role: user.role};
        //password verify ke liye bcrypt library ka compare function use krenge
        if(await bcrypt.compare(password, user.password)){
            //password matched ab login krana h

            //login krate time jwt token create krana h authentication ke liye
            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "2h"});   //JWT_SECRET ko env file se load krnaa pdega using dotenv
            
            //Ab token to bn gya use cookie ke ander daalke bhej denge user ko simple

            //to user ke object m hi ek token section add kr diya aur password mughe htana pdega kyuki vo nhi dena h 
            user = user.toObject();
            user.token = token;
            user.password = undefined; //ye password user ke object se remove hua h database m se nhi hua ok
            //cookie creation : 3 parameters pass krne pdenge - Cookie name, cookie data, options
            const options = {
                expires: new Date(Date.now() + 30000),
                httpOnly: true,  //mtlb ise access nhi kr sakte client side pr
            }
            res.cookie("Gaurav Cookie", token, options).status(200).json({
                success: true,
                token, user,
                message: "User Logged In successfully",
            });


        }
        else{
            //password not matched
            return res.status(403).json({
                success: false,
                message: "Password Incorrect"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure",
        })
    }
}