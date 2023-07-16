require("dotenv").config({path: ".env"});
const express = require("express");
const app = express();
const cors = require("cors");
const UserRoutes = require("./routes/user");
const port = 3000;

// middleware
app.use(express.json());
app.use(cors());
app.use(UserRoutes);

app.listen(port, ()=> console.log("server running..."));