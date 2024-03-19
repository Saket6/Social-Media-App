// import React from 'react'
import '../css/home.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {  useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { NavLink } from 'react-router-dom';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { useState } from 'react';
import { Requests } from './Requests';
import { Notifications } from './Notifications';

export const Navbar = () => {

  const curr_user=useSelector((state)=>state?.user);
  const noofNots=useSelector((state)=>state?.nots);
  const Navigate=useNavigate();
  const [show,setShow]=useState(false);
  // const [noofNots,setnoofNots]=useState(0);
  const Logout=async()=>
  {
    try{
      const res=await fetch('https://social-media-app-n8uj.onrender.com/logout',{
        method: 'GET',
        headers: {'Content-Type': 'application/json',},
        credentials: 'include'
        
      })
      await res.json();
      console.log(res);

      toast.success("Successfully Logged Out",{'theme':'dark'});
      Navigate('/login');
      
    }catch(e){console.log(e);}
  }

  return (
    <div className='Navbar'>
      <div className="left">
           <h1 className='heading'>MySocialZ</h1>
           <input type="text" className="search" id='search' placeholder='Search here...' />
           <SearchIcon className='searchIcon'/>
      </div>
        <div className="right left">
        <CircleNotificationsIcon style={{'color':'white','fontSize':'35px','marginRight':'10px','cursor':'pointer'  }} onClick={()=>setShow(!show)}  />
        {
          noofNots>0?(<Notifications/>):('')
        }
       
          <button className="logout flex-center" onClick={Logout} >Log out<LogoutIcon className='logoutbtn'  /></button>
          <LogoutIcon onClick={Logout} className='logoutbtn' id='logoutId'  />
          {/* <LogoutIcon className='logoutbtn' onClick={Logout} /> */
            show?<Requests show={show} setShow={setShow}  />:''
          }
        
          {
            curr_user?<NavLink to='/profile' ><img className='accountImg' src={`https://social-media-app-n8uj.onrender.com/assets/${curr_user.picturepath}`} alt="prof" /></NavLink>:<AccountCircleIcon className='dummyLogo'/>
            // curr_user? <p style={{'color':'white'}}>{curr_user.name}</p> :<AccountCircleIcon className='dummyLogo'/>
          }
          
        </div>
        
    </div>
  )
}
