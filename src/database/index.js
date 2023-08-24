import mongoose from "mongoose"

mongoose.connect("mongodb://127.0.0.1:27017/noderest")
mongoose.Promise = global.Promise

export default mongoose