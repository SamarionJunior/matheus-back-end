import mongoose from "mongoose"

mongoose.connect("mongodb://127.0.0.1:27017/matheus")
mongoose.Promise = global.Promise

export default mongoose