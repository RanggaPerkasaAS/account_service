const express = require("express");
const cors = require("cors")
const app = express();

app.use(cors())

const router = require("./routers/router")
app.use("/api",router)

app.listen(8000,()=>{
    console.log("server run in port 8000");
})