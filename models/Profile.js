const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    bio:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    profile_photo:{
        type: String,
        required: true 
    },
    destination:{
        type: String,
        required: true 
    }
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;