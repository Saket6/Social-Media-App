import React, { useEffect, useState} from 'react'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from 'react-redux';
import {io} from 'socket.io-client'

export const Users = ({addRemoveFriend}) => {

    const [allUsers,setUsers]=useState([]);
    const user = useSelector((state) => state.user)
    const socket = io('https://social-media-app-n8uj.onrender.com');

    const getUsers=async()=>
    {
        try{
            const res=await fetch('https://social-media-app-n8uj.onrender.com/users',{
                'method': 'GET',
                'headers':{
                    'Content-Type': 'application/json'
                },
                'credentials': 'include'
            })

            const resp=await res.json();
            setUsers(resp.allUsers);
            console.log(resp.allUsers);
          
        }catch(e){console.log(e);}
    }

    


    useEffect(()=>
    {
        getUsers();          

    },[])
    return (
        <div>
            <h5>Suggested for you</h5>
            <div className="users">
                {
                    allUsers.filter((e)=>
                    {
                        return !(user.friends.includes(e._id))
                    }).map((user,i)=>
                    {
                        return(
                            <div key={i} className="usersDiv">
                                <img src={`https://social-media-app-n8uj.onrender.com/assets/${user.picturepath}`} alt="" className="imgs"   />
                                <span>{user.name}</span>
                                <div className='flex-center end' >
                                    <GroupAddIcon className='add' style={{'justifySelf':'end'}}  onClick={()=>addRemoveFriend(user._id)} /> 
                                </div>
                               
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
