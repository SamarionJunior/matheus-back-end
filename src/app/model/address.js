import mongoose from "../../database/index.js";
// import bcryptjs from "bcryptjs";


const AddressSchema = new mongoose.Schema({
    bairro: {
        type: String,
        require: true,
    },
    rua: {
        type: String,
        require: true,
    },
    tipo: {
        type: String,
        require: true,
    },
    numero: {
        type: String,
        require: true,
    },
    complemento: {
        type: String,
        require: true,
    },
}, { collection : 'Address' });

const Address = mongoose.model('Address', AddressSchema);

export default Address;