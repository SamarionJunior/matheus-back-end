import express from "express"
import bodyParser from "body-parser"

// console.clear()

const PORT = 3030

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

import produtoController from "./app/controllers/produtoController.js";
import userController from "./app/controllers/userController.js";
import shoppingcarController from "./app/controllers/shoppingcarController.js";
import paymentAreaController from "./app/controllers/paymentAreaController.js";
import orderController from "./app/controllers/orderController.js";

produtoController(app)
userController(app)
shoppingcarController(app)
paymentAreaController(app)
orderController(app)

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