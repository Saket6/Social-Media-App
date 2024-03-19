const mongoose=require('mongoose');

const PostSchema=new mongoose.Schema({
    userid:{
        type: 'String',
        required: true,
    },
    name: {
        type: 'String',
        required: true,
    },
    type:{
        type: 'String',
        required: true,
    },
    userpicturepath:{
        type: 'String',
        required: true,
    },
    picturepath:{
        type: 'String',
        required: true,
    },
    description: String,
    // location: String,
    likes:{
        type: Map,
        of: Boolean,
        default: new Map()
    },
    comments:{
        type: Array,
        default: []
    }

},
{
    timestamps: true
});

const Post=mongoose.model('Post', PostSchema);

module.exports=Post;