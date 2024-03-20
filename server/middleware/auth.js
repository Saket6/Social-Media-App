const jwt=require('jsonwebtoken');
const User=require('../models/User');
require('dotenv').config()

const auth=async (req,res,next)=>
{
    console.log("at auth");
    const token=req.cookies.user;
    console.log('token is',token);
    try{
        if(token)
        {
            console.log(" token found :",token);
            const verify=jwt.verify(token,process.env.SECRET_KEY);
            console.log(process.env.SECRET_KEY);
            const curruser=await User.findOne({_id: verify.id});
            console.log(curruser);
            req.currUser=curruser;
            // console.log("Token Verified",req.currUser.name);
        }
    }
   catch(e){
    console.log("error at verifying token at auth");
    console.log(e);
   }
    

    next();
}

module.exports=auth;