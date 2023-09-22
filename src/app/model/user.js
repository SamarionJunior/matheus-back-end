import mongoose from "../../database/index.js";
// import bcryptjs from "bcryptjs";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: String,
        select: false,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
}, { collection : 'User' });

// UserSchema.pre("save", async function(next){
//     const hash = await bcryptjs.hash(this.password, 10)
//     this.password = hash;
//     next()
// })

const User = mongoose.model('User', UserSchema);

export default User;