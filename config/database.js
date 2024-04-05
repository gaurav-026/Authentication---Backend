const mongoose = require("mongoose");
require("dotenv").config();

const dbconnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
    .then(()=>{
        console.log("DB connection successful");
    })
    .catch((error)=>{
        console.log("Connection Error in Db");
        console.log(error);
        process.exit(1);
    })
};
module.exports = dbconnect;