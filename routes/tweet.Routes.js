const {Router, response}=require("express");

const UserModel=require("../models/userModel");
const TweetModel=require("../models/TweetModel");

const tweetRouter=Router();


tweetRouter.get("/",async (req,res)=>{
    const tweet=await TweetModel.find();
    res.send({responseData:tweet});
})


tweetRouter.post("/create", async (req, res) => {
    try {
        const { title, category, body } = req.body;
        console.log(req.user_id)
        const author_id = req.user_id;

        console.log(author_id);

        const user = await UserModel.find({ _id: author_id });

        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }

        console.log(user);

        const new_tweet = new TweetModel({
            title,
            category,
            body,
            author: user.name
        });

        await new_tweet.save();
        res.status(201).send({ msg: "Tweet created" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error in creating tweet");
    }
});


tweetRouter.put("/edit/:ID",async (req,res)=>{
    const ID=req.params.ID;
    const payload=req.body;

    const user_id=req.user_id;
    const user=await UserModel.findOne({_id:user_id});
    const user_email=user.email;


    const tweet=await TweetModel.findOne({_id:ID});
    const tweet_author_email=user.email;

    if(user_email!==tweet_author_email){
        res.send("you are not authorised")
    }else{
        await TweetModel.findByIdAndUpdate(ID,payload);
        res.send(`tweet ${ID} edited`)
    }
})

tweetRouter.delete("/delete/:ID",async (req,res)=>{
    const ID=req.params.ID;
    const payload=req.body;

    const user_id=req.user_id;
    const user=await UserModel.findOne({_id:user_id});
    const user_email=user.email;


    const tweet=await TweetModel.findOne({_id:ID});
    const tweet_author_email=user.email;

    if(user_email!==tweet_author_email){
        res.send("you are not authorised")
    }else{
        await TweetModel.findByIdAndDelete(ID);
        res.send(`log ${ID} deleted`)
    }
})

module.exports={tweetRouter}