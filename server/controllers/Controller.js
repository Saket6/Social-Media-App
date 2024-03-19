const User = require('../models/User');
const Post = require('../models/Post');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config()

const SECRET_KEY = process.env.SECRET_KEY;



const Register = async (req, res) => {
    const { name, email, password, c_password, phone, DOB, picturepath } = req.body;
    if (email === " " || password === "" || c_password === "" || name === "" || phone === "" || DOB === "" || picturepath == "")
        return res.status(400).json({ error: 'Please fill all fields' });
    try {

        const exist_user = await User.findOne({ email: email });
        if (exist_user) {
            return res.status(400).json({ "error": "User already exists.Please sign in" });
        }
        else {
            if (password !== c_password) {
                return res.status(400).json({ "error": "Password must be same as confirm password" });
            }
            else {
                const enc_pass = await bcrypt.hash(password, 10);
                const enc_c_pass = await bcrypt.hash(c_password, 10);
                const newuser = new User({ name, email, password: enc_pass, c_password: enc_c_pass, phone, DOB, picturepath });
                const resp = await newuser.save();
                return res.status(200).json({ message: "Registration successful" });
            }
        }
    }
    catch (err) { console.log(err); }

}

const Login = async (req, res) => {
    const { email, password } = req.body;
    const exist_user = await User.findOne({ email: email });
    if (!exist_user)
        return res.status(400).json({ error: 'Not registered yet' });
    else {
        const validPassword = await bcrypt.compare(password, exist_user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid login credentials' });
        }
        else {
            const tokendata = {
                id: exist_user._id,
                date: Date.now(),
            }
            const token = jwt.sign(tokendata, SECRET_KEY);
            res.cookie("user", token, { maxAge: 9000000, secure: false },);
            // console.log(res.cookie);
            return res.status(200).json({ message: "Signed in successfully",user: exist_user });
        }
    }
}


const Logout = (req, res) => {
    res.cookie("user", "", { maxAge: -1, secure: false },);
    const idString=req.currUser._id.toString();
    // console.log(idString);
    // console.log(global.onlineUsers.get(idString));
    global.onlineUsers.delete(idString);
    console.log(global.onlineUsers);
    res.json({ message: "Logged out successfully" });
}

const getUser = async (req, res) => {
    try {
        if(req.currUser)
        {
            console.log(req.currUser);
            const friends = await Promise.all(
                req.currUser.friends.map((id) => User.findById(id))
            )
            return res.status(201).json({ 'user': req.currUser, 'friends': friends });
    
        }
        else{
            return res.status(401).json({'user': "0" });
        }
       
        // console.log(friends);


    }
    catch (e) {
        console.log(e);
    }

}

// const getFriends=async(req,res)=>
// {
//     try{
//         const id=req.params.id;
//         const user=await User.findById(id);
//         const friends=await Promise.all(
//             user.friends.map((id)=>User.findById(id))
//         )
//         return res.status(201).json(friends);
//     }  
//     catch(e){
//         console.log(e);
//     } 

// }


const getRequests = async (req, res) => {
    const userid = req.currUser._id;
    const user = await User.findById(userid);
    const requests = await Promise.all(
        user.requests.map((id) => User.findById(id))
    )
    return res.status(200).json(requests);
}

const addRemoveFriends = async (req, res) => {
    try {
        const { friendid } = req.params;
        const userid = req.currUser._id;
        const user = await User.findById(userid);
        const friend = await User.findById(friendid);
        // console.log(friend,user);
        if (user.friends.includes(friendid)) {
            user.friends = user.friends.filter((id) => id != friendid);
            friend.friends = friend.friends.filter((id) => id!=userid);
            await user.save();
            await friend.save();
            return res.status(201).json({ message: "Friend removed" });
            // friend.friends=friend.friends.filter((id)=>id!=userid);
        }
        else {
            // user.friends.push(friendid);
            if (friend.requests.includes(userid)) {
                friend.requests = friend.requests.filter((id) => id != userid);
                console.log("Request aborted\n");
                // await user.save();
                await friend.save();
                return res.status(201).json({ message: "Friend request aborted", code: 0 });
            }
            else {
                friend.requests.push(userid);
                console.log("Request sent\n");
            }

            await user.save();
            await friend.save();
            return res.status(201).json({ message: "Friend request sent", code: 1 });
            // friend.friends.push(userid);
        }

        // const friends=await Promise.all(
        //     user.friends.map((id)=>User.findById(id))
        // )

    }
    catch (e) {
        console.log(e);
    }
}


const createPost = async (req, res) => {
    try {
        const { userid, description, picturepath,type } = req.body;
        const user = await User.findById(userid);
        const post = new Post({
            userid,
            name: user.name,
            description,
            type,
            userpicturepath: user.picturepath,
            picturepath: picturepath,
            likes: {},
            comments: []
        });

        await post.save();
        const friendsIDs = (req.currUser.friends);
        const allPosts = await Post.find({ $or: [{ userid: { $in: friendsIDs } }, { userid: req.currUser._id }] });
        allPosts.reverse();
        // const allPosts=await Post.find();
        return res.status(201).json({ message: "new post created..", allPosts });
    }
    catch (e) {
        console.log("Error in creating new post\n", e);
    }
}

const deletePost=async(req,res)=>
{
    try{
        const postId=req.params.id;
        console.log("post to be deleted: ",postId);
        await Post.deleteOne({_id:postId});
        const friendsIDs = req.currUser.friends;
        const updatedPosts = await Post.find({ $or: [{ userid: { $in: friendsIDs } }, { userid: req.currUser._id }] });
        updatedPosts.reverse();
        return res.status(201).json({updatedPosts});
    }
    catch(e){console.log(e);}
}

const getAllPosts = async (req, res) => {
    try {
        // console.log(req.currUser);
        // const friendsIDs=(req.body.friends);
        const friendsIDs = req.currUser.friends;
        // console.log(friendsIDs);
        const allPosts = await Post.find({ $or: [{ userid: { $in: friendsIDs } }, { userid: req.currUser._id }] });
        // console.log(allPosts);
        allPosts.reverse();
        return res.status(200).json({ message: "All Posts:", allPosts });
    } catch (e) {
        console.log("error at finding posts", e);
    }

}


const userPosts = async (req, res) => {
    const { userid } = req.params;
    const userPosts = await Post.find({ userid });
    return res.status(200).json({ message: "All Posts:", userPosts });
}


const likePost = async (req, res) => {
    const { _id } = req.params;
    // console.log(_id);
    const userid = req.currUser._id;

    const post = await Post.findOne({ _id });
    // console.log(post);
    // console.log(userid); 
    if (post.likes.get(userid)) {
        post.likes.delete(userid);
        await post.save();
        return res.status(201).json({ 'message': 'Liked Post', 'code': 0 });
    }
    else {
        post.likes.set(userid, true);
        await post.save();
        return res.status(201).json({ 'message': 'Liked Post', 'code': 1 });

    }


    // may need to use Update command 
}

const commentPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findOne({ _id: postId });
        // console.log(post.comments);
        post.comments.push(req.body.comment);
        await post.save();
        return res.status(201).json({ 'message': 'Comment Posted' });
    }
    catch (e) {
        console.log(e);
    }
}
const allUsers = async (req, res) => {
    try {
        const allUsers = await User.find({ _id: { $ne: req.currUser._id } });
        return res.status(201).json({ allUsers });
    } catch (e) { console.log(e); }
}

module.exports = { Register, Login, getUser, createPost,deletePost, getRequests, addRemoveFriends, getAllPosts, userPosts, likePost, Logout, commentPost, allUsers }