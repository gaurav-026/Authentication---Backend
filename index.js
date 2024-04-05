const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

//cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.use(express.json());


//import route and mount
const user = require("./routes/user");
app.use("/api/v1", user);

const dbconnect = require("./config/database");
dbconnect();

app.listen(PORT, ()=>{
    console.log(`App is running successfully at port ${PORT}`);
});

app.get("/", (req, res)=>{
    res.send("This is the message");
})