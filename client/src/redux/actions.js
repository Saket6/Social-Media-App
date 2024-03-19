

const User=(userid)=>
{
    return{
        type:'setUser',
        payload: userid
    }
}

const Friends=(friends)=>
{
    return{
        type:'setFriends',
        payload: friends
    }
}

const Mode=()=>
{
    return{
        type:'changeMode'
    }
}

const post=()=>
{
    return{
        type:'post'
    }
}

const Nots=(no)=>
{
    return{
        type:'Nots',
        payload: no
    }
}

export {User,Friends,Mode,post,Nots}