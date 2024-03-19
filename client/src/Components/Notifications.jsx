import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
export const Notifications = () => {

const noofNots=useSelector((state)=>state?.nots);
  

// useEffect(()=>
// {
//     // console.log(noofNots);
// },[noofNots])
return(
    <div className='nots'>
        {
            noofNots>0?(
                <div>
                    {
                        // noofNots
                        ""
                    }
                </div>
            ):('')
        }
    </div>
)
 
}
