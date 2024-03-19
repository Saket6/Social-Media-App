/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Friends, Mode, post } from "../redux/actions";
import { Navbar } from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import { Loading } from "../Components/Loading";
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { CreatePost } from "../Components/CreatePost";
import { Users } from "../Components/Users";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import {io} from 'socket.io-client'
export const Home = () => {

 

  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const curr_user = useSelector((state) => state?.user);
  let friends = useSelector((state) => state?.friends);
  const socket = io('http://localhost:3000');

  const getUser = async () => {
    try {
      const res = await fetch("https://social-media-app-n8uj.onrender.com/getUser", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const resp = await res.json();
      const user=resp.user;
      if(user!=='0')
      {
        console.log(user);
        console.log("friends: ", resp.friends);
        dispatch(User(user));
        dispatch(Friends(resp.friends));
      }
      else{
        Navigate("/login");
      }
      
    } catch (err) {
      console.log(err);
      
      toast.error("Please Sign in", { theme: "dark" });
    }
  };


  const addRemoveFriend=async(id)=>
    {
        try{
            const res=await fetch(`https://social-media-app-n8uj.onrender.com/user/friends/${id}`,{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include'

            })
            
            const resp=await res.json();
        
            if(resp.code)
            {
               
            socket.emit('sendFriendRequest', [curr_user._id, id ]);
            }
           
            else{
              dispatch(Friends(friends.filter(friend => friend._id !== id)));
            }
            
            toast.success(resp.message,{'theme':'dark'})

        }
    catch(e){console.log(e);}
    }

    const confirm = (id) => {
      confirmAlert({
        title: 'Remove Friend?',
        message: 'Are you sure you want to Remove this friend?',
        buttons: [
          {
            label: 'Remove',
            onClick: ()=>addRemoveFriend(id)
          },
          {
            label: 'No',
            onClick: () => ""
          }
        ]
      });
  };

 

  useEffect(() => {
    getUser();
    // console.log("use effect called Home");


  }, []);

  if (!curr_user) {
    return <Loading />;
  }
  return (
    <>
    <Navbar />
      <div className="homePage">
        <div className="leftDiv">
          <section className="sec">
            {curr_user ? (
              <img
                className="accountImg"
                src={`https://social-media-app-n8uj.onrender.com/assets/${curr_user.picturepath}`}
                alt="prof"
              />
            ) : (
              ""
            )}

            <div className="frnds">
              <span style={{ fontWeight: "bold" }}> {curr_user.name} </span>
              <span style={{fontSize:'small', color:'gray'}} >{`${curr_user.friends.length} friends`}</span>
            </div>
          </section>
          <hr />
          <section className="users">
            {
              friends.map((e,i)=>
              {
                return (
                  <div className="usersDiv" style={{'marginLeft':'10px'}}  key={i}>
                    <img src={`https://social-media-app-n8uj.onrender.com/assets/${e.picturepath}`} alt="" className="imgs"/>
                    <span> {e.name} </span>  
                    <GroupRemoveIcon className="add" onClick={()=>confirm(e._id)} />  
                     
                  </div>
                 
                )
              })
            }
           
          </section>
          {/* <section className="sec"></section> */}
        </div>
        
        <CreatePost/>

        <div className="rightDiv">
              <Users addRemoveFriend={addRemoveFriend} />
        </div>
      </div>
      <ToastContainer/>
    </>
  );
};
