import mongoose from "../../database/index.js";
// import bcryptjs from "bcryptjs";


const InformationSchema = new mongoose.Schema({
    address: {
        type: String,
    },
}, { collection : 'Information' });

const Information = mongoose.model('Information', InformationSchema);

export default Information;