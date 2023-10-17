import express from "express"
import bodyParser from "body-parser"

import cors from "cors"

// console.clear()

const PORT = process.env.PORT || 3030

const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

import produtoController from "./src/app/controllers/produtoController.js";
import userController from "./src/app/controllers/userController.js";
import shoppingcarController from "./src/app/controllers/shoppingcarController.js";
import paymentAreaController from "./src/app/controllers/paymentAreaController.js";
import orderController from "./src/app/controllers/orderController.js";

produtoController(app)
userController(app)
shoppingcarController(app)
paymentAreaController(app)
orderController(app)

import testController from "./src/app/controllers/testController.js"

testController(app)

app.listen(PORT)

export default app


// import hbs from "nodemailer-express-handlebars";

// app.use(bodyParser.urlencoded({extended: true}))

// app.engine(
//     'hbs',
//     hbs({
//        extname: "hbs",
//        defaultLayout: "",
//        layoutsDir: "",
//     })
//  );

// import controllers from "./app/controllers/index.js"
// controllers(app)

// import authController from "./app/controllers/authController.js"
// import projectController from "./app/controllers/projectController.js"

// authController(app)
// projectController(app)