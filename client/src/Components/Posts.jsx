import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import '../css/Post.css'
import { ToastContainer, toast } from "react-toastify";
import {io} from 'socket.io-client'
import { LikeComment } from './LikeComment';
import { Nots} from "../redux/actions";

export const Posts = ({ allPosts }) => {

  const user = useSelector((state) => state.user)
  const friends = useSelector((state) => state?.friends);
  const [posts, setPosts] = useState(allPosts);
  const noofNots=useSelector((state)=>state?.nots);
  const dispatch = useDispatch();
 

  const deletePost=async(id)=>
  {
    try{
      const res=await fetch(`http://localhost:5000/deletePost/${id}`,{
        method: 'GET',
        headers:{
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      const resp=await res.json();
      console.log(resp);
      setPosts(resp.updatedPosts);
      toast.success("Post Deleted",{theme:'dark'})
    }
    catch(e){console.log(e);}
  }

  useEffect(() => {
 
    setPosts(allPosts);
    
    
    // console.log("curr user is :  ", user);
  }, [allPosts])

  useEffect(()=>
  {
    const videos=document.querySelectorAll('.videos');
    videos.forEach((video)=>
    {
      let play=false;
      video.addEventListener('click',()=>{
        console.log('clicked');
        if(!play) {video.play(); play=true; }
        else {video.pause();  play=false; } 
      })
    })
    console.log("called");
  },[posts])
  useEffect(() => {
 
    // console.log("use effect called");
    const socket = io('http://localhost:3000');
    socket.emit('addUser', user._id);

    socket.on('newFriendRequest', (data) => {
      const { senderId, message } = data;
      console.log("no of Nots:",noofNots);
      dispatch(Nots(noofNots+1));
      toast.success(`${senderId} sent you Friend request`, {'theme': 'dark'})
    });


    socket.on('friendRequestAccepted', (data) => {
      console.log("accepted"); 
      const { rec, message } = data;
      toast.success(`You are now friends with ${rec}`, {'theme': 'dark'})

    });

    console.log(friends)
    

  }, [user])

 
  return (
    <div className='posts'>
      {
        posts.map((e,index) => {
          return (
            <div className="box postDiv" key={index} >
              <section className="sec">
                <img className='accountImg' src={`http://localhost:5000/assets/${e.userpicturepath}`} alt="" />
                <h5 style={{'marginLeft':'10px'}} >{e.name}</h5>
                
              </section>
              <section className="sec">
                <p>
                  {e.description}
                </p>
              </section>
              <section className="sec">
                {
                  e.type.startsWith('image/')?(
                    <img src={`http://localhost:5000/assets/${e.picturepath}`} className='postImg' alt="Hello" />
                  ):(
                    <video src={`http://localhost:5000/assets/${e.picturepath}`} className='postImg videos '   ></video>
                  )
                }
               
              </section>
              
              {/* <section className="sec">
                {
                  liked?<FavoriteIcon style={{'color':'red'}} onClick={like}   />:<FavoriteBorderIcon onClick={like} />
                }
              
              <CommentIcon/>
              </section> */}
              <LikeComment post={e} deletePost={deletePost} />
            </div>
          )

        })
      }
    </div>
  )
}
