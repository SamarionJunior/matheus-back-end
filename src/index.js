import express from "express"
import bodyParser from "body-parser"

import hbs from "nodemailer-express-handlebars";

const PORT = 3030

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.engine(
    'hbs',
    hbs({
       extname: "hbs",
       defaultLayout: "",
       layoutsDir: "",
    })
 );

// import controllers from "./app/controllers/index.js"
// controllers(app)

import authController from "./app/controllers/authController.js"
import projectController from "./app/controllers/projectController.js"

authController(app)
projectController(app)

app.listen(PORT)

export default app