import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

User.plugin(mongoosePaginate);

export default mongoose.model('user', User);
