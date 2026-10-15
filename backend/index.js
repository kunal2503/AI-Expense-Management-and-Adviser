const express = require("express");
const cors = require("cors");
const connectDB = require("./DB/connnectDB");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes =  require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

connectDB();

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/expense",expenseRoutes);
app.use("/api/budget",budgetRoutes);

app.get("/", (req,res) => {
    console.log("Hello World");
})



app.listen(3000, () => {
    console.log("Server is Running on port 3000");
})