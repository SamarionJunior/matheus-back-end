import mongoose from "../../database/index.js";


const ProductSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    preco: {
        type: Number,
        required: true,
        default: 0,
    },
    quantidade: {
        type: Number,
        required: true,
        default: 0,
    },
    descricao: {
        type: String,
        require: true,
        default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tellus augue, imperdiet vitae risus in, laoreet efficitur neque. Integer finibus convallis metus, non feugiat lorem posuere a.",
    }
}, { collection : 'Product' });

const Product = mongoose.model('Product', ProductSchema);

export default Product;