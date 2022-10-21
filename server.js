const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config();
const port = process.env.PORT;

const Routes = require("./routes/index");

const uri = process.env.MONGODB_ATLAS_URI;

app.use(express.json());
app.use(cors({ origin: true, methods: "GET,HEAD,POST,PUT,PATCH,DELETE", credentials: true }));
app.use(cookieParser());

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) console.log(err);
    else console.log("mongodb connected successfully");
});

app.use("/", Routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})