import dummy from '../assets/user.png';
import { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Register = () => {

  const Navigate=useNavigate();
  const [userDet,setUserDet]=useState({
    name:'',
    email:'',
    password:'',
    c_password:'',
    phone:'',
    DOB:'',
    picturepath: '',
  })

  const handleInputs=(e)=>
  {
    if(e.target.type=='file'){
      setUserDet((prev)=>
      {
        return{
          ...prev,picturepath: e.target.files[0]
        }
      })
    }else{
      setUserDet((prev)=>
      {
        return{
          ...prev,[e.target.name]:e.target.value
        }
      })
    }
  }

    const handleSubmit=async(e)=>
    {
      try{
        e.preventDefault();
        const formdata=new FormData();
        formdata.append('profile',userDet.picturepath);
        const profile=await fetch('https://social-media-app-n8uj.onrender.com/profile',{
          method: 'POST',
            // headers:{
            //   'Content-Type': 'multipart/form-data'
            // },
            body: formdata
        })
        const ImgName=await profile.json();
        console.log(ImgName);


        const res=await fetch('https://social-media-app-n8uj.onrender.com/user/register',{
        method: 'POST',
        headers:{ 'Content-Type': 'application/json'},
        body: JSON.stringify({...userDet,picturepath:ImgName.filename})
        })

        const response=await res.json();
        if(res.status===400)
        {
          toast.error(response.error,{'position': 'top-right','theme': 'dark'});
          throw new Error(response.error)
        }
        else{
          toast.success("Registered successfully",{ "position": 'top-right',"theme":"dark"});
          setTimeout(()=>
          {
            Navigate('/');
          },2000)
        }
        
      }
      catch(e)
      {
        console.log(e);
      }
       
    }


  return (
    <div className="flex-center h-100">
             
        <form action="" className="form flex-center flex-col" onSubmit={handleSubmit} encType="multipart/form-data"  >
          <img src={dummy} className='dummy'  alt="" />
          <input type="text" name="name" className="inputs"   onChange={handleInputs} placeholder="Username" id="" />
          <input type="email" className="inputs" name='email'  onChange={handleInputs} placeholder="Email" />
          <input type="password" className="inputs" name='password'  onChange={handleInputs} placeholder="Password" />
          <input type="password" className="inputs" name='c_password'   onChange={handleInputs}placeholder="Confirm Password" />
          <input type="number" className="inputs" name='phone'  onChange={handleInputs} placeholder="Phone Number" />
          <input type="date" className="inputs" name='DOB'  onChange={handleInputs} placeholder="DOB" />
          <input type="file" className="inputs" name='profile'  onChange={handleInputs} />
          <button className="loginbtn p-0" type='submit'>SIGN UP</button>
        <p>Already Registered? <span> <NavLink to='/login'>Sign in</NavLink> </span> </p>
        </form>
        <ToastContainer/>
      </div>

)}
