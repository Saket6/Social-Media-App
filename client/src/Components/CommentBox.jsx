import React, { useEffect, useState } from 'react'

export const CommentBox = ({ handleSubmit, handleComment, show, setShow ,comments}) => {

    const [allcomments,setComments]=useState(comments);

    const hide=() =>
    {
        setShow(!show);
        document.body.style.overflowY = 'scroll'
    } 

    useEffect(()=>
    {
        show?document.body.style.overflow = 'hidden':document.body.style.overflow = 'scroll'
        // document.body.style.overflow = 'hidden';
        console.log('called comments');
        setComments(comments);
    },comments,show,setShow)

    return (
        <div className="modal">

            <div className="commentBox flex-center-col ">
                <div style={{ 'display': 'flex', 'justifyContent': 'end', 'alignItems': 'end', }} > <span style={{ 'cursor': 'pointer' }} onClick={hide} >❌</span> </div>
                <div className='flex-center' style={{'marginTop':'20px'}} >
                    <input type="text" className='commentInput' required onChange={handleComment} placeholder='Please Comment...' />
                    <button className='submitBtn' onClick={handleSubmit}  >Comment</button>
                </div>
                <section className="all">
                    {
                        allcomments.map((comment,i)=>
                        {
                            return(
                                <div key={i} className='comment'>
                                    <img className='accountImg' src={`https://social-media-app-n8uj.onrender.com/assets/${comment.picturepath}`} alt="" style={{'marginRight':'10px'}} />
                                  {comment.comment}
                                </div>
                            )
                        })
                    }
                </section>

            </div>

        </div>

    )
}
