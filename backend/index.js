const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./DB/connnectDB");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

connectDB();

app.use(cors());

app.use("/api/auth", authRoutes);

app.get("/", (req,res) => {
    console.log("Hello World");
})



app.listen(3000, () => {
    console.log("Server is Running on port 3000");
})