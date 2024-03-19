import React, { useEffect } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import {useSelector } from "react-redux";
import { CommentBox } from './CommentBox';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


export const LikeComment = ({post,deletePost}) => {

    const curr_user = useSelector((state) => state?.user);
    const [liked, setLiked] = useState(post.likes[curr_user._id]);
    const [noofLikes,setnoofLikes]=useState(post.likes.length);
    const [noofCmts,setnoofCmts]=useState(post.comments.length);
    const [show,setShow]=useState(false);
    
    const [comment,setComment]=useState({
        by: curr_user.name,
        picturepath: curr_user.picturepath,
        comment:''
    })



    const confirm = () => {
        confirmAlert({
          title: 'Delete post',
          message: 'Are you sure you want to delete this post?',
          buttons: [
            {
              label: 'Delete',
              onClick: () => deletePost(post._id)
            },
            {
              label: 'No',
              onClick: () => ""
            }
          ]
        });
    };



    const like = async() => {

        try{
            const res=await fetch(`http://localhost:5000/like/${post._id}`,{
                'method':'POST',
                'headers':{'Content-Type':'application/json'},
                'credentials':'include',
            })
            const resp=await res.json();
            console.log(resp);
            setLiked(!liked);
            if(resp.code===0){
                setnoofLikes(noofLikes-1);
            }
            else{
                setnoofLikes(noofLikes+1);
            }
            
        }
        catch(e){console.log(e);}

    }

    const handleComment=(e)=>
    {
        setComment((prev)=>
        {
            return{
                ...prev,comment:e.target.value
            }
        })
    }

    const handleSubmit=async(e)=>
    {
        e.preventDefault();
        try{
            const res=await fetch(`http://localhost:5000/comment/${post._id}`,{
                'method': 'POST',
                'headers': {'Content-Type': 'application/json'},
                'body': JSON.stringify({comment}),
                'credentials':'include'
            })

            const resp=await res.json();
            setnoofCmts(noofCmts+1);
            post.comments.push(comment);
            console.log(resp);
        }
        catch(e){console.log(e)}  
      }

    useEffect(()=>
    {   
        const len = Object.keys(post.likes).length;
        const cmtLen=post.comments.length;
        setnoofCmts(cmtLen);
        setnoofLikes(len); 
        if(post.likes[curr_user._id]){
            setLiked(true);
        }
        else setLiked(false);
    },[post])

    return (
        <>
        <section className="sec">
            {
                liked ? <FavoriteIcon className='liked'  onClick={like} /> : <FavoriteBorderIcon onClick={like} style={{'cursor':'pointer'}}/>
            }
            <span style={{'marginLeft':'6px'}}>{noofLikes} Likes</span>
            <CommentIcon style={{'marginLeft':'10px','cursor':'pointer'}} id='cmt'  onClick={()=>setShow(!show)} />
            <span style={{'marginLeft':'6px'}} >{noofCmts} Comments</span>
            {
                  post.userid==curr_user._id?(<DeleteIcon className='add' onClick={()=>confirm()}   style={{marginLeft:'auto', marginRight:'10px', color:'red',  }}   />):("")
            }
        </section>
        {
            show?(
               <CommentBox handleSubmit={handleSubmit} handleComment={handleComment} show={show} setShow={setShow}  comments={post.comments} />
            ):("")
        }
        </>
        
    )
}
