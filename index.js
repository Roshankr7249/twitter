const express= require("express")

const app= express();
app.use(express.json());
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

require("dotenv").config();
const cors=require("cors")
app.use((cors({
    origin:"*"
})))

const connection=require("./config/db")
const UserModel=require("./models/userModel")
const {authentication}=require("./middleware/authMiddleware");
const { tweetRouter } = require("./routes/tweet.Routes");
app.get("/",(req,res)=>{
    res.send("base api Url")
})

app.post("/signup", (req, res) => {
    let { name, email, password,gender,country } = req.body;
    bcrypt.hash(password, 3, async function (err, hash) {
        const new_user = new UserModel({
            name,
            email,
            password: hash,
            gender,
            country
        })
        try {
            await new_user.save();
            res.send({ message: "signUp sucessfully" });
        } catch (err) {
            console.log(err);
            res.status(500).send({ msg: "something went wrong" });
        }
    });
})



app.post("/login", async (req, res) => {
    let { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        res.send({ mesaage: "login first" });
    } else {
        const hash_pass = user.password
        bcrypt.compare(password, hash_pass, function (err, result) {
            if (!result) {
                res.send({ message: "login failed, invalid credentails" });
            } else {
                var token = jwt.sign({ }, process.env.SECRET_KEY);
                res.send({ message: "login sucessfull", token: token });
            }
        });
    }

})

app.use("/tweet",tweetRouter);

const PORT=process.env.PORT;
app.listen(PORT, async()=>{
   
    try {
        await connection;
        console.log("connected to db sucessfully")
        console.log(`listening on port ${PORT}`)
    } catch (error) {
        console.log(error)
    }
    
})