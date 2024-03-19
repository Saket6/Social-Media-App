import "../css/login.css";
import dummy from '../assets/user.png';
import { NavLink,useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useState,useEffect } from "react";
import { useDispatch ,useSelector} from "react-redux";
import {User} from '../redux/actions'
export const Login = () => {


  const dispatch=useDispatch();
  const Navigate=useNavigate();
  const curr_user = useSelector((state) => state?.user);

  const [userDet,setUserDet]=useState({
    email:'',
    password:'',
  })

  const handleInputs=(e)=>
  {
    setUserDet(()=>
    {
      return{
        ...userDet,[e.target.name]:e.target.value
      }
    })
  }

  const login=async(e)=>
  {
    e.preventDefault();
    try{
      const res=await fetch('http://localhost:5000/user/login',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDet),
        credentials: 'include'
      })

      const resp=await res.json();
      if(res.status===400)
      {
        toast.error(resp.error,{'position':'top-right','theme': 'dark'})
        
      }
      else{
        toast.success(resp.message,{'position':'top-right','theme': 'dark'})

        // dispatch(User(resp.user));

        setTimeout(()=>
        {
          Navigate('/');
        },3000)
      }

      console.log(resp);
    }
    catch(e){
      console.log(e);
    }
  

  }

  const getUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/getUser", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const resp = await res.json();
      const user=resp.user;
      if(user!='0') Navigate('/');
    }
    catch(e){console.log(e);}
  
  }

 useEffect(()=>{
  
  getUser();
 },[])

  return (
    <>
      <div className="loginPage flex-center h-100">
        <form action="" className="form flex-center flex-col p-1" onSubmit={login} >
        <img src={dummy} className='dummy'  alt="" />
          <input type="email" className="inputs" placeholder="Email" name="email" onChange={handleInputs} />
          <input type="password" className="inputs" placeholder="Password" name="password" onChange={handleInputs} />
        <button type="submit" className="loginbtn p-0" >SIGN IN</button>
        <p>Not registered yet? <span> <NavLink to='/register'>Sign up</NavLink> </span> </p>
        </form>
      </div>
      <ToastContainer/>
    </>
  );
};
