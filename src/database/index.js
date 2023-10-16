import mongoose from "mongoose"

// mongoose.connect("mongodb://127.0.0.1:27017/matheus")
mongoose
    .connect(
        "mongodb+srv://root:1234@teste001.5jtmp5c.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }
    ).then(
        () => console.log("Mongo atlas Connected")
    ).catch(
        (error) => console.log(error)
    )

mongoose.Promise = global.Promise

export default mongoose