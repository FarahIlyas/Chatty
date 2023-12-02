//Models is kind of like a blueprint which fields you are gona have inside a model. it is like a table in sql.

import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
    type: String,
    required: true,
    unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
    followers: {
        type: [String],
        default: [],
    },
    following: {
        type: [String],
        default: [],
    },
    bio: {
        type: String,
        default: "",
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
// it will create users in your database
// we will call the 'User' and use "userSchema" to create a new user.
// mongoose converts "User" into users for DB.

export default User;