import React, { useEffect, useState } from 'react'
import { Navbar } from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import Tabs from '@mui/material/Tabs';
import { User, Friends, Mode, post } from "../redux/actions";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { confirmAlert } from 'react-confirm-alert'; // Import

import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import Box from '@mui/material/Box';
// import { userPosts } from '../../../server/controllers/Controller';

export const Profile = () => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state?.user);
    let friends = useSelector((state) => state?.friends);


    const [value, setValue] = useState("1");
    const [allUserPosts, setUserPosts] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const addRemoveFriend=async(id)=>
    {
        try{
            const res=await fetch(`http://localhost:5000/user/friends/${id}`,{
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
  


    const getUser = async () => {
        try {
            const res = await fetch("http://localhost:5000/getUser", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const resp = await res.json();
            const user1 = resp.user;
            if (user !== '0') {
                console.log(user1);
                console.log("friends: ", resp.friends);
                dispatch(User(user1));
                dispatch(Friends(resp.friends));
            }
            else {
                Navigate("/login");
            }

        } catch (err) {
            console.log(err);

            toast.error("Please Sign in", { theme: "dark" });
        }
    };


    const getUserPosts = async () => {
        try {
            if (user) {
                const Posts = await fetch(`http://localhost:5000/posts/${user._id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                })

                const userPosts = await Posts.json();
                setUserPosts(userPosts.userPosts)
                console.log(userPosts);


            }
        } catch (e) { console.log(e); }
    }


    useEffect(() => {
        console.log("called again")
        getUser();

    }, []);

    useEffect(() => {
        getUserPosts();
    }, [user])

    return (
        <>

            <Navbar />
            {
                user ? (
                    <div className="profileDiv">
                        <div className="middleDiv" id='proftop'>
                            <div className='cols'>
                                <img className='profImg' src={`http://localhost:5000/assets/${user.picturepath}`} alt="prof" />
                                <span>{user.name}</span>
                            </div>
                            <div className='cols'>
                                <h2>Posts</h2>
                                <span>{allUserPosts.length}</span>
                            </div>
                            <div className='cols'>
                                <h2>Friends</h2>
                                <span>{user.friends.length}</span>
                            </div>

                        </div>
                        <div className="bottomDiv">
                            <TabContext value={value}>
                                <Box className="box" >
                                    <TabList indicatorColor="secondary" textColor='secondary' onChange={handleChange} aria-label="lab API tabs example">
                                        <Tab className='head' label="Posts" value="1" />
                                        <Tab className='head' label="Friends" value="2" />
                                        <Tab className='head' label="Suggested" value="3" />
                                    </TabList>
                                </Box>
                                <TabPanel className='panel' value="1">
                                    {
                                        allUserPosts.map((e, index) => {
                                            return (
                                                <div className="box postDiv" key={index} >
                                                    <section className="sec">
                                                        <img className='accountImg' src={`http://localhost:5000/assets/${e.userpicturepath}`} alt="" />
                                                        <h5 style={{ 'marginLeft': '10px' }} >{e.name}</h5>

                                                    </section>
                                                    <section className="sec">
                                                        <p>
                                                            {e.description}
                                                        </p>
                                                    </section>
                                                    <section className="sec">
                                                        {
                                                            e.type.startsWith('image/') ? (
                                                                <img src={`http://localhost:5000/assets/${e.picturepath}`} className='postImg' alt="Hello" />
                                                            ) : (
                                                                <video src={`http://localhost:5000/assets/${e.picturepath}`} className='postImg videos '   ></video>
                                                            )
                                                        }

                                                    </section>
                                                </div>
                                            )

                                        })
                                    }
                                </TabPanel>
                                <TabPanel className='panel' value="2">
                                    <section className="users">
                                        {
                                            friends.map((e, i) => {
                                                return (
                                                    <div className="usersDiv" style={{ 'marginLeft': '10px' }} key={i}>
                                                        <img src={`http://localhost:5000/assets/${e.picturepath}`} alt="" className="imgs" />
                                                        <span> {e.name} </span>
                                                        <GroupRemoveIcon className="add" onClick={() => confirm(e._id)} />

                                                    </div>

                                                )
                                            })
                                        }

                                    </section>
                                </TabPanel>
                                <TabPanel className='panel' value="3">Item Three</TabPanel>
                            </TabContext>
                        </div>
                    </div>

                ) : ("")
            }

            )
        </>

    )
}
