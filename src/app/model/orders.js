import mongoose from "../../database/index.js";
// import bcryptjs from "bcryptjs";


const OrdersSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    quantidade: {
        type: Number,
        require: true,
        default: 0,
    }
}, { collection : 'Orders' });

// UserSchema.pre("save", async function(next){
//     const hash = await bcryptjs.hash(this.password, 10)
//     this.password = hash;
//     next()
// })

const Orders = mongoose.model('Orders', OrdersSchema);

export default Orders;