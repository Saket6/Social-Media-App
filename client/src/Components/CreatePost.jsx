
import { useEffect, useState } from "react";
import {useSelector } from "react-redux";
import { Loading } from "../Components/Loading";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {Posts} from "../Components/Posts";
import { ToastContainer, toast } from 'react-toastify';
export const CreatePost = () => {

    const curr_user = useSelector((state) => state?.user);
    const [allPosts,setPosts]=useState([]);

    const [postDet,setPostDet]=useState({
      picture:'',
      description:''
    });


    const handlePost=(e)=>
    {
      if(e.target.type=='file'){
        setPostDet(()=>
        {
          return{
            ...postDet,picture: e.target.files[0]
          }
        })
      }
      else{
        setPostDet(()=>
        {
          return{
            ...postDet,[e.target.name]: e.target.value
          }
        })
      }
    }


    const submitPost=async(e)=>
    {
      try{
        e.preventDefault();
        const formdata=new FormData();
        formdata.append('profile',postDet.picture);
        const profile=await fetch('https://social-media-app-n8uj.onrender.com/profile',{
          method: 'POST',
            body: formdata
        })
        const ImgName=await profile.json();
        // console.log(ImgName);

        const res=await fetch('https://social-media-app-n8uj.onrender.com/createpost',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body:JSON.stringify({
            userid: curr_user._id,
            picturepath: ImgName.filename,
            type: ImgName.filetype,
            description: postDet.description,
          }),
          credentials:'include'
      })

      const resp=await res.json();
      // console.log(resp);
      setPosts(resp.allPosts);
      toast.success("New post created successfully",{'theme':'dark','autoClose':'true'})
      setPostDet({});
      }
      catch(e){console.log(e);}
    }


    const getPosts=async()=>
    {
      try{
        if(curr_user){
          const Posts=await fetch('https://social-media-app-n8uj.onrender.com/posts/all',{
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({friends:curr_user.friends}),
            credentials: "include",
          })
  
          const friendsPosts=await Posts.json();
          // console.log(friendsPosts);
          setPosts(friendsPosts.allPosts);
        }
       
      }
      catch(e){console.log(e);}
    }

    useEffect(()=>
    {
      getPosts();
    },[])


    if (!curr_user) {
      return <Loading />;
    }

  return (
    <div className="mid">
        <div className="middleDiv">
          <section className="create">
            <div className="top">
              {curr_user ? (
                <img
                  className="accountImg"
                  src={`https://social-media-app-n8uj.onrender.com/assets/${curr_user.picturepath}`}
                  alt="prof"
                 
                />
              ) : (
                ""
              )}
          
              <input
                type="text"
                className="post search"
                name="description"
                placeholder="What's on your mind..."
                onChange={handlePost}
                required
              />
            </div>
            {/* <hr /> */}
            <div className="top" style={{ padding: "20px", display: "flex" }}>
              <input
                type="file"
                name="profile"
                id="file"
                style={{
                  position: "absolute",
                  opacity: "0",
                  height: "0.1px",
                  width: "0.1px",
                }}
                required
                onChange={handlePost}
              />
              <label className="fileinput" htmlFor="file">
                <AddPhotoAlternateIcon style={{ "marginRight": "4px" }} />
                Image/Video
              </label>

              {/* <input
                type="file"
                name="video"
                id="videofile"
                style={{
                  position: "absolute",
                  opacity: "0",
                  height: "0.1px",
                  width: "0.1px",
                }}
                required
                onChange={handlePost}
              />
               <label className="fileinput" htmlFor="videofile">
                <AddPhotoAlternateIcon style={{ "marginRight": "4px" }} />
                Video
              </label> */}

              <button
              type="Submit"
                className="fileinput submit"
                style={{
                  marginLeft: "10px",
                  border: "none",
                  backgroundColor: "pink",
                  alignItems: "center",
                }}
                onClick={submitPost}
              >
                Create Post
              </button>
            </div>
          </section>
         
        </div>
         {
            allPosts.length>0?<Posts allPosts={allPosts} />:"Loading latest posts..."
          }
        
        
    </div>
  )
}
