const express=require('express');
const {Register,Login,getUser,getRequests,getFriends,createPost,deletePost,addRemoveFriends,getAllPosts,userPosts,allUsers,Logout,likePost,commentPost}=require('../controllers/Controller');
const auth=require('../middleware/auth');
const Router=express.Router();



Router.get('/',auth,(req,res)=>
{
    console.log(req.curruser);
    res.send("Home page from Router");
})

Router.post('/user/register',Register);
Router.post('/user/login',Login);
Router.get('/logout', auth ,Logout);

//USER ROUTES
Router.get('/getUser', auth ,getUser);
// Router.post('/user/friends/:id',getFriends);
Router.get('/requests', auth,  getRequests);
Router.get('/user/friends/:friendid', auth ,addRemoveFriends);
Router.get('/users',auth, allUsers);

//POST ROUTES
Router.post('/createpost', auth ,createPost);
Router.post('/posts/all', auth ,getAllPosts);
Router.post('/posts/:userid', auth ,userPosts);
Router.get('/deletePost/:id', auth ,deletePost);

Router.post('/like/:_id', auth ,likePost)
Router.post('/comment/:postId', auth, commentPost); 



module.exports=Router;