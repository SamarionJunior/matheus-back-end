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

// router.use((_req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
//     next();
// });

router.use(async (_req, res, next) => {
    const defaultUser = await User.findOne({name: "user 01"});
    _req.userId = defaultUser._id.toString()
    next();
});

// GET

router.get("/", async (req, res) => {
    try{
        const shoppingcars = await ShoppingCar.find().populate('userId').populate('productId');
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error getting all " + textController, res);
    }
})

router.get("/shoppingCarId/:shoppingCarId", async (req, res) => {
    try{
        const shoppingCarId = req.params.shoppingCarId;

        const itemInCar = await ShoppingCar.find({_id: shoppingCarId}).populate('userId').populate('productId');
        return res.send({itemInCar});
    }catch(error){
        return Erro(error, "Error getting " + textController + " by id", res);
    }
})

router.get("/userId/:userId", async (req, res) => {
    try{
        const userId = req.params.userId;

        const itemInCar = await ShoppingCar.find({ userId: userId}).populate('userId').populate('productId');
        return res.send({itemInCar});
    }catch(error){
        return Erro(error, "Error getting " + textController + " by id", res);
    }
})

router.get("/productId/:productId", async (req, res) => {
    try{
        const productId = req.params.productId;

        const itemInCar = await ShoppingCar.find({ productId: productId}).populate('userId').populate('productId');
        return res.send({itemInCar});
    }catch(error){
        return Erro(error, "Error getting " + textController + " by id", res);
    }
})

router.get("/:productId", async (req, res) => {
    try{
        const productId = req.params.productId;
        const userId = req.userId;

        const itemInCar = await ShoppingCar.find({userId: userId, productId: productId}).populate('userId').populate('productId');
        return res.send({itemInCar});
    }catch(error){
        return Erro(error, "Error getting " + textController + " by id", res);
    }
})

// POST

router.post("/all", async (req, res) => {
    try{
        const idProductsFromClientSide = req.body;
        const userId = req.userId;

        await Promise.all(idProductsFromClientSide.map(async idProductFromClientSide => {
            const { id } = idProductFromClientSide;
        
            const product = await Product.findById(id);
            
            const itemInCar = await ShoppingCar.findOne({userId: userId, productId: id});
    
            if(itemInCar !== null){
                if(product.quantidade > 0){
                    itemInCar.quantidade++;
                    product.quantidade--;
                    await itemInCar.save()
                    await product.save()
                }
            }else{
                if(product.quantidade > 0){
                    const shoppingcar = await ShoppingCar.create({userId: userId, productId: id, quantidade: 1});
                    product.quantidade--;
                    await shoppingcar.save()
                    await product.save()
                }
            }
        }))
        
        const shoppingcars = await ShoppingCar.find().populate('userId').populate('productId');
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error posting all " + textController, res);
    }
})

router.post("/:productId", async (req, res) => {
    try{
        const productId = req.params.productId;
        const userId = req.userId;
        
        const product = await Product.findById(productId);
        
        const itemInCar = await ShoppingCar.findOne({userId: userId, productId: productId});

        if(itemInCar !== null){
            if(product.quantidade > 0){
                itemInCar.quantidade++;
                product.quantidade--;
                await itemInCar.save()
                await product.save()
            }
        }else{
            if(product.quantidade > 0){
                const shoppingcar = await ShoppingCar.create({userId: userId, productId: product._id.toString(), quantidade: 1});
                product.quantidade--;
                await shoppingcar.save();
                await product.save();
            }
        }
        
        const shoppingcars = await ShoppingCar.find().populate('userId').populate('productId');
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error posting " + textController + " by id", res);
    }
})

// PUT

router.put("/reset/add/", async (req, res) => {
    try{
        const userId = req.userId;
        const products = await Product.find();

        await Promise.all(products.map(async product => {
            const productId = product._id.toString();
            
            const itemInCar = await ShoppingCar.findOne({userId: userId, productId: productId});
    
            if(itemInCar !== null){
                if(product.quantidade > 0){
                    itemInCar.quantidade++;
                    product.quantidade--;
                    await itemInCar.save()
                    await product.save()
                }
            }else{
                if(product.quantidade > 0){
                    const shoppingcar = await ShoppingCar.create({userId: userId, productId: productId, quantidade: 1});
                    product.quantidade--;
                    await shoppingcar.save()
                    await product.save()
                }
            }
        }))
        
        const shoppingcars = await ShoppingCar.find()
        // .populate('userId').populate('productId');
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error updating all " + textController, res);
    }
})

router.put("/reset/remove/", async (req, res) => {
    try{
        const userId = req.userId;
        const productsFromShoppingCar = await ShoppingCar.find();

        await Promise.all(productsFromShoppingCar.map(async productFromShoppingCar => {
            const productId = productFromShoppingCar.productId.toString();
            
            const product = await Product.findById(productId);
    
            if((productFromShoppingCar.quantidade - 1) > 0){
                product.quantidade++;
                productFromShoppingCar.quantidade--;
                await product.save()
                await productFromShoppingCar.save()
            }else{
                const shoppingcar = await ShoppingCar.deleteMany({userId: userId, productId: productId});
                product.quantidade++;
                await product.save()
            }
        }))
        
        const shoppingcars = await ShoppingCar.find()
        // .populate('userId').populate('productId');
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error updating all " + textController, res);
    }
})

router.put("/remove/:productId", async (req, res) => {
    try{
        const productId = req.params.productId;
        const userId = req.userId;

        const itemInCar = await ShoppingCar.findOne({userId: userId, productId: productId});

        const product = await Product.findById(productId);
        
        if(itemInCar !== null){
            if(itemInCar.quantidade > 1){
                itemInCar.quantidade--;
                product.quantidade++;
                await itemInCar.save();
                await product.save();

            }else{
                await ShoppingCar.deleteMany({_id: itemInCar._id.toString()})
                product.quantidade++;
                await product.save();
            }
        }
        
        const shoppingcars = await ShoppingCar.find()
        .populate('userId').populate('productId');
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error updating " + textController + " by id", res);
    }
})

router.put("/add/:productId", async (req, res) => {
    try{
        const productId = req.params.productId;
        const userId = req.userId;

        const product = await Product.findById(productId);
    
        const itemInCar = await ShoppingCar.findOne({userId: userId, productId: productId});

        if(product !== null){
            if(product.quantidade > 0){
                if(itemInCar !== null){
                    itemInCar.quantidade++;
                    product.quantidade--;
                    await itemInCar.save();
                    await product.save();
                }else{
                    const shoppingcar = await ShoppingCar.create({userId: userId, productId: productId, quantidade: 1});
                    product.quantidade--;
                    await shoppingcar.save();
                    await product.save();
                }
            }
        }

        
        const shoppingcars = await ShoppingCar.find()
        .populate('userId').populate('productId');
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error updating " + textController + " by id", res);
    }
})

// DELETE

// router.delete("/", async (req, res) => {
//     try{

//         const shoppingcar = await ShoppingCar.deleteMany({});
        
//         const shoppingcars = await ShoppingCar.find().populate('userId').populate('productId');
//         return res.send({shoppingcars});
//     }catch(error){
//         return Erro(error, "Error deleting all " + textController, res);
//     }
// })

router.delete("/", async (req, res) => {
    try{

        const userId = req.userId;

        const productsFromShoppingCar = await ShoppingCar.find();

        // await ShoppingCar.deleteMany({});

        await Promise.all(productsFromShoppingCar.map(async productFromShoppingCar => {

            const productId = productFromShoppingCar.productId.toString();
            const shoppingcarId = productFromShoppingCar._id.toString();

            const productFormProduct = await Product.findById(productId);

            productFormProduct.quantidade += productFromShoppingCar.quantidade;

            await ShoppingCar.deleteMany({_id: shoppingcarId})
        
            await productFormProduct.save()
        }))
        
        const shoppingcars = await ShoppingCar.find()
        .populate("userId").populate("productId");
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error updating all " + textController, res);
    }
})

router.delete("/shoppingcarId/:shoppingcarId", async (req, res) => {
    try{
        const shoppingcarId = req.params.shoppingcarId;

        const shoppingcar = await ShoppingCar.findOneAndRemove({_id: shoppingcarId});
        
        const shoppingcars = await ShoppingCar.find().populate('userId').populate('productId');
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error deleting " + textController + " by id", res);
    }
})

router.delete("/userId/:userId", async (req, res) => {
    try{
        const userId = req.params.userId;

        const shoppingcar = await ShoppingCar.deleteMany({userId: userId});
        
        const shoppingcars = await ShoppingCar.find().populate('userId').populate('productId');
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error deleting " + textController + " by id", res);
    }
})

router.delete("/productId/:productId", async (req, res) => {
    try{
        const productId = req.params.productId;

        const shoppingcar = await ShoppingCar.deleteMany({productId: productId});
        
        const shoppingcars = await ShoppingCar.find().populate('userId').populate('productId');
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error deleting " + textController + " by id", res);
    }
})

router.delete("/:productId", async (req, res) => {
    try{
        const productId = req.params.productId;
        const userId = req.userId;

        const shoppingcar = await ShoppingCar.findOne({userId: userId, productId: productId});

        const product = await Product.findById(productId);

        if(shoppingcar !== null){
            const shoppingcarId = shoppingcar._id.toString()
            if(product !== null){

                product.quantidade += shoppingcar.quantidade;
        
                await ShoppingCar.deleteMany({_id: shoppingcarId});

                product.save()
            }
        }
        
        const shoppingcars = await ShoppingCar.find().populate('userId').populate('productId');
        return res.send({shoppingcars});
    }catch(error){
        return Erro(error, "Error deleting " + textController + " by id", res);
    }
})

// PRODUCTS LIST
export default app => app.use("/shoppingcar", router);
