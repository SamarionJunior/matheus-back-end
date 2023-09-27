import express from "express";

import User from "../model/user.js";
import Product from "../model/product.js"

import ShoppingCar from "../model/shoppingcar.js";
import PaymentArea from "../model/paymentarea.js";
import Order from "../model/order.js";

import Orders from "../model/orders.js";

import { Erro } from "./function.js";

const textController = "Shopping Car"

const router = express.Router();

router.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
});

router.use(async (_req, res, next) => {
    const defaultUser = await User.findOne({name: "user 01"});
    _req.userId = defaultUser._id.toString()
    next();
});

// GET

router.get("/", async (req, res) => {
    try{
        const productsInPaymentarea = await PaymentArea.find()
        // .populate('userId').populate('productId');
        return res.send({productsInPaymentarea});
    }catch(error){
        return Erro(error, "Error getting all " + textController);
    }
})

// POST

router.post("/", async (req, res) => {
    try{
        const idProductsFromClientSide = req.body;
        const userId = req.userId;

        await Promise.all(idProductsFromClientSide.map(async idProductFromClientSide => {
            const { id } = idProductFromClientSide;
        
            const productInShoppingCar = await ShoppingCar.findOne({userId: userId, productId: id});
            
            const itemInPaymentArea = await PaymentArea.findOne({userId: userId, productId: id});
            
            if(productInShoppingCar !== null){
                if(itemInPaymentArea !== null){
                    if(productInShoppingCar.quantidade > 0){
                        itemInPaymentArea.quantidade += productInShoppingCar.quantidade;
                        await ShoppingCar.deleteMany({_id: productInShoppingCar._id.toString()});
                        await itemInPaymentArea.save()
                    }
                }else{
                    if(productInShoppingCar.quantidade > 0){
                        const itemInPaymentArea = await PaymentArea.create({userId: userId, productId: id, quantidade: productInShoppingCar.quantidade});
                        await ShoppingCar.deleteMany({_id: productInShoppingCar._id.toString()});
                        await itemInPaymentArea.save()
                    }
                }

            }
        }))
        
        const itemsInPaymentArea = await PaymentArea.find().populate('userId').populate('productId');
        return res.send({itemsInPaymentArea});
    }catch(error){
        return Erro(error, "Error posting all " + textController);
    }
})

// PUT

router.put("/reset", async (req, res) => {
    try{
        const userId = req.userId;
        const productsFromShoppingCar = await ShoppingCar.find();

        await Promise.all(productsFromShoppingCar.map(async productFromShoppingCar => {
            const productId = productFromShoppingCar.productId.toString();
            
            const itemFromPaymentArea = await PaymentArea.findOne({userId: userId, productId: productId});
    
            if(itemFromPaymentArea !== null){
                itemFromPaymentArea.quantidade += productFromShoppingCar.quantidade;
                await ShoppingCar.deleteMany({userId: userId, productId: productId});
                await itemFromPaymentArea.save()
            }else{
                const paymentarea = await PaymentArea.create({userId: userId, productId: productId, quantidade: productFromShoppingCar.quantidade});
                await ShoppingCar.deleteMany({userId: userId, productId: productId});
                await paymentarea.save()
            }
        }))
        
        const paymentareas = await PaymentArea.find()
        // .populate('userId').populate('productId');
        return res.send({paymentareas});
    }catch(error){
        console.log(error);
        return Erro(error, "Error updating all " + textController);
    }
})

// DELETE

router.delete("/", async (req, res) => {
    try{
        const userId = req.userId;
        const productsFromPaymentArea = await PaymentArea.find();

        await Promise.all(productsFromPaymentArea.map(async productFromPaymentArea => {
            const productId = productFromPaymentArea.productId.toString();
            
            const itemFromShoppingCar = await ShoppingCar.findOne({userId: userId, productId: productId});
    
            if(itemFromShoppingCar !== null){
                itemFromShoppingCar.quantidade += productFromPaymentArea.quantidade;
                await PaymentArea.deleteMany({userId: userId, productId: productId});
                await itemFromShoppingCar.save()
            }else{
                const shoppingcar = await ShoppingCar.create({userId: userId, productId: productId, quantidade: productFromPaymentArea.quantidade});
                await PaymentArea.deleteMany({userId: userId, productId: productId});
                await shoppingcar.save()
            }
        }))
        
        const paymentareas = await PaymentArea.find()
        // .populate('userId').populate('productId');
        return res.send({paymentareas});
    }catch(error){
        return Erro(error, "Error deleting all " + textController);
    }
})

router.delete("/all", async (req, res) => {
    try{
        
        const userId = req.userId;

        await PaymentArea.deleteMany({userId: userId});
        
        const itemsInPaymentArea = await PaymentArea.find().populate('userId').populate('productId');
        return res.send({itemsInPaymentArea});
    }catch(error){
        return Erro(error, "Error deleting all " + textController);
    }
})


export default app => app.use("/paymentarea", router);




// router.get("/paymentareaId/:paymentareaId", async (req, res) => {
//     try{
//         const paymentareaId = req.params.paymentareaId;

//         const productsinPaymentarea = await PaymentArea.findOne({_id: paymentareaId}).populate('userId').populate('productId');
//         return res.send({productsinPaymentarea});
//     }catch(error){
//         return Erro(error, "Error getting " + textController + " by id");
//     }
// })

// router.get("/userId/:userId", async (req, res) => {
//     try{
//         const userId = req.params.userId;

//         const productsinPaymentarea = await PaymentArea.find({ userId: userId}).populate('userId').populate('productId');
//         return res.send({productsinPaymentarea});
//     }catch(error){
//         return Erro(error, "Error getting " + textController + " by id");
//     }
// })

// router.get("/productId/:productId", async (req, res) => {
//     try{
//         const productId = req.params.productId;

//         const productsinPaymentarea = await PaymentArea.find({ productId: productId}).populate('userId').populate('productId');
//         return res.send({productsinPaymentarea});
//     }catch(error){
//         return Erro(error, "Error getting " + textController + " by id");
//     }
// })

// router.get("/:productId", async (req, res) => {
//     try{
//         const productId = req.params.productId;
//         const userId = req.userId;

//         const productinPaymentarea = await PaymentArea.find({userId: userId, productId: productId}).populate('userId').populate('productId');
//         return res.send({productinPaymentarea});
//     }catch(error){
//         return Erro(error, "Error getting " + textController + " by id");
//     }
// })