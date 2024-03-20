import React, { useEffect, useState } from 'react'
import {io} from 'socket.io-client'
import { useSelector ,useDispatch } from 'react-redux';
export const Requests = ({ show, setShow}) => {


  const [req, setReq] = useState([]);
  const user = useSelector((state) => state.user)
  const noofNots=useSelector((state)=>state?.nots);
  const dispatch = useDispatch();

  const hide = () => {
    setShow(!show);
    document.body.style.overflowY = 'scroll'
  }


  const getRequests = async () => {
    const response = await fetch('https://social-media-app-n8uj.onrender.com/requests', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
    });
    const data = await response.json();
    setReq(data);
    console.log("requests are:  ", data);
  }


  const acceptReject=(id,accept)=>
  {
    console.log("accept value is : ",accept);
    const socket = io('https://social-media-app-n8uj.onrender.com');
    if(accept)
    {
      socket.emit('acceptFriendRequest', [id,user._id]);
      setReq((prev)=>
      {
       return prev.filter((req)=>
       {
        return req._id!==id
       })
      })
    }
    else{
      socket.emit('rejectFriendRequest', [id,user._id]);
      setReq((prev)=>
      {
       return prev.filter((req)=>
       {
        return req._id!==id
       })
      })
    }

    dispatch(Nots(noofNots-1));
  }

  useEffect(() => {
    show ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'scroll';
    getRequests();



  }, [show])
  return (
    <div className="modal">
      <div className='commentBox flex-center-col '>
        <div style={{ 'display': 'flex', 'justifyContent': 'end', 'alignItems': 'end', }} > <span style={{ 'cursor': 'pointer' }} onClick={hide} >❌</span> </div>
        {/* <div className='flex-center' style={{'marginTop':'20px'}} > */}
        <div className="requestsDiv">
          {
          req.length===0?<h4 style={{marginLeft: '20px'}} >No new requests.</h4>:
            req.map((e,index) => {
              return (
               

                  <div key={index} className='request flex-center'>  <img className='imgs' style={{marginRight:'10px'}}  src={`https://social-media-app-n8uj.onrender.com/assets/${e.picturepath}`} alt="" />   {e.name} sent friend request  
                  <button onClick={()=>acceptReject(e._id,1)} className='acceptBtn'  >☑️</button> 
                  <button onClick={()=>acceptReject(e._id,0)} className='rejectBtn'>❌</button>
                  </div> 
              


              )
            })
          }
        </div>
      </div>
      {/* </div> */}
    </div>
  )
}
