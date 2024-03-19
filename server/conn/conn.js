const mongoose=require('mongoose');

const conn=async ()=>
{
    try{
        await mongoose.connect(process.env.mongourl);
        console.log("Connected to DB");
    }
    catch(e)
    {
        console.log("Not Connected To DB");
        console.log(e);
    }
}

module.exports=conn;

