import mongoose from "../../database/index.js";


const ProdutoSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
        default: "Produto 1",
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
    },
    noCarrinho: {
        type: Number,
        required: true,
        default: 0,
    },
    emProcessoDePagamento: {
        type: Number,
        required: true,
        default: 0,
    },
    NosPedidos: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        require: true,
        default: "Em Produção",
    }
}, { collection : 'Produto' });

const Produto = mongoose.model('Produto', ProdutoSchema);

export default Produto;