import mongoose from "../../database/index.js";
// import bcryptjs from "bcryptjs";


const PaymentAreaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    quantidade: {
        type: Number,
        require: true,
        default: 0,
    }
}, { collection : 'PaymentArea' });

// UserSchema.pre("save", async function(next){
//     const hash = await bcryptjs.hash(this.password, 10)
//     this.password = hash;
//     next()
// })

const PaymentArea = mongoose.model('PaymentArea', PaymentAreaSchema);

export default PaymentArea;