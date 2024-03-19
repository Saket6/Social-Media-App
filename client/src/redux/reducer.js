// import Post from '../../../server/models/Post';
// import {Mode,User,post} from './actions';

const initialState={
    mode: 'dark',
    user:null,
    friends:[],
    posts:[],
    nots: 0
}



const reducer=(state=initialState,action)=>
{
    switch(action.type)
    {
        case 'changeMode':{
            return{
                ...state,mode: state.mode=='dark'?'light':'dark'
            }
        }
        case 'setUser':{
            return{
                ...state,user:action.payload
            }
        }
        case 'setFriends':{
            return{
                ...state,friends:action.payload
            }
        }
        case 'post':{
            return 
        }
        case 'Nots':{
            return{
                ...state,nots:action.payload
            }
        }
        default:
            return state;
    }
}

export {reducer};

