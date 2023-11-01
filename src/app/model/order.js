import mongoose from "../../database/index.js";
// import bcryptjs from "bcryptjs";


const OrderSchema = new mongoose.Schema({
    status: {
        type: String,
        require: true,
        default: "Em Produção",
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now,
    },
    contact: {
        type: String,
    },
    tipoDePagamento: {
        type: String,
    },
    troco: {
        type: String,
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
}, { collection : 'Order' });

// UserSchema.pre("save", async function(next){
//     const hash = await bcryptjs.hash(this.password, 10)
//     this.password = hash;
//     next()
// })

const Order = mongoose.model('Order', OrderSchema);

export default Order;