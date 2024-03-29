// const app=require('./app.js')
// const server=require('http').createServer(app);
const User=require('./models/User');

  global.onlineUsers=new Map();

  const PORT=process.env.PORT || 5000;

module.exports=function socket(server)
{
  const io = require('socket.io')(server,{
    cors: {
      origin: "https://social-media-app-1-n8hx.onrender.com"
    }
  });
      io.on('connection', client => {;
        client.on('addUser' , (id)=>
        {
            global.onlineUsers.set(id,client.id);
            console.log("user added to room:  ", id);
            console.log(global.onlineUsers);
        } )
        client.on('disconnect', () => {console.log("User disconnected");  console.log(global.onlineUsers) });

        client.on('sendFriendRequest', async (data) => {
            const [ senderId, receiverId ] = data;
            const sender=await User.findById(senderId);
            const receiver=await User.findById(receiverId);

            console.log(`Friend request from ${sender} to ${receiver}`);
            const recSocketId=global.onlineUsers.get(receiverId);
            io.to(recSocketId).emit('newFriendRequest', { senderId:sender.name, message: 'You have a new friend request!' });
        });
    
        client.on('acceptFriendRequest', async (data) => {
            const [ senderId, receiverId ] = data;

            const rec=await User.findById(receiverId);
            rec.friends.push(senderId);
            const send=await User.findById(senderId);
            send.friends.push(receiverId);
            rec.requests=rec.requests.filter((id)=>{
              return id!=senderId;
            })
            await rec.save();
            await send.save();

            const sendSocketId=global.onlineUsers.get(senderId);
            const recSocketId=global.onlineUsers.get(receiverId);
            console.log(`${receiverId} accepted friend request from ${senderId}`);
           
            // console.log("sendsocketId:  " ,sendSocketId);
            io.to(sendSocketId).emit('friendRequestAccepted', { rec:rec.name, message: 'Your friend request was accepted!' });
            io.to(recSocketId).emit('friendRequestAccepted', { rec:send.name, message: 'Your friend request was accepted!' });
           
        });

        client.on('rejectFriendRequest', async(data) => {
          const [ senderId, receiverId ] = data;
          const rec=await User.findById(receiverId);
          rec.requests=rec.requests.filter((id)=>{
            return id!=senderId;
          })
          await rec.save();
          // const recSocketId=global.onlineUsers.get(receiverId);
          // io.to(recSocketId).emit('friendRequestRejected', { rec:rec.name, message: 'Your friend request was accepted!' });
          console.log("Friend request rejected");
          
      });

      });
      
      server.listen(PORT,()=>
      {
        console.log(`Server Listening on port ${PORT}`);
      });
}

// module.exports=socket;
