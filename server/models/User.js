const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({

    name: {
        type: 'String',
        required: true,
    },
    email: {
        type: 'String',
        required: true,
    },
    password:{
        type: 'String',
        required: true,
    },
    c_password:{
        type: 'String',
        required: true,
    },
    phone:{
        type: 'Number',
        required: true,
    },
    DOB:{
        type:  'Date',
        required: true,
    },
    // gender:{
    //     type: 'String',
    //     required: true,
    // },
    picturepath:{
        type: 'String',
        default: "",
    },
    friends: {
        type: [String],
        default: []
    },
    requests:{
        type: [String],
        default:[]
    }

},
{
    timestamps:true
}
);

const Users=mongoose.model('Users',UserSchema);

module.exports = Users;