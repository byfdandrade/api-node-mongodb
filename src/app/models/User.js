import mongoose from "mongoose";

const User = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    cpf:{
        type: String,
        unique: true,
        require: true
    },
    password:{
        type: String,
        require: true
    }
}, {
    timestamps: true,
});

export default mongoose.model('user', User);
