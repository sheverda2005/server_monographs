require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose");
const router = require("./routers/router");
const cookieParser = require("cookie-parser")
const cors = require("vercel-cors")

const app = express()

const PORT = process.env.PORT || 5000


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: true
}))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://monographs.vercel.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use("/api", router)

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, ()=> {
            console.log("Server has been started......")
        })

    } catch (e) {

    }

}

start()