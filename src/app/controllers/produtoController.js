import express from "express";

import Product from "../model/product.js"

import { Erro } from "./function.js";

const textController = "Product"

const router = express.Router();

router.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
});

// GET

router.get("/", async (req, res) => {
    try{
        const products = await Product.find();
        return res.send({products});
    }catch(error){
        return Erro(error, "Error getting all " + textController);
    }
})

router.get("/:productId", async (req, res) => {
    try{
        const productId = req.params.productId;

        
        const product = await Product.findById(productId);
        return res.send({product});
    }catch(error){
        return Erro(error, "Error getting " + textController + " by id");
    }
})

// POST

router.post("/", async (req, res) => {
    try{
        const {nome, preco, quantidade} = req.body;

        const product = await Product.create({nome, preco, quantidade});
        
        await product.save()
        
        const products = await Product.find();
        return res.send({products});
    }catch(error){
        return Erro(error, "Error posting all " + textController);

    }
})

router.post("/all", async (req, res) => {
    try{

        const productsFromClientSide = req.body;

        await Promise.all(productsFromClientSide.map(async productFromClientSide => {
            const {nome, preco, quantidade} = productFromClientSide;

            const product = await Product.create({nome, preco, quantidade});
        
            await product.save()
        }))
        
        const products = await Product.find();
        return res.send({products});
    }catch(error){
        return Erro(error, "Error posting " + textController + " by id");

    }
})

// PUT

router.put("/", async (req, res) => {
    try{

        const productsFromClientSide = req.body;

        await Promise.all(productsFromClientSide.map(async productFromClientSide => {

            const {id, nome, preco, quantidade} = productFromClientSide;

            const product = await Product.findByIdAndUpdate(id, {nome, preco, quantidade});
        
            await product.save()
        }))
        
        const products = await Product.find();
        return res.send({products});
    }catch(error){
        return Erro(error, "Error updating all " + textController);

    }
})

router.put("/reset", async (req, res) => {
    try{

        const productsFromClientSide = req.body;

        await Product.deleteMany({});

        await Promise.all(productsFromClientSide.map(async productFromClientSide => {

            const {nome, preco, quantidade} = productFromClientSide;

            const productInDataBase = await Product.create({nome, preco, quantidade});
        
            await productInDataBase.save()
        }))
        
        const products = await Product.find();
        return res.send({products});
    }catch(error){
        return Erro(error, "Error updating all " + textController);
    }
})

router.put("/:productId", async (req, res) => {
    try{
        const productId = req.params.productId;
        
        const {nome, preco, quantidade} = req.body;

        const product = await Product.findByIdAndUpdate(productId, {nome, preco, quantidade});
        
        const products = await Product.find();
        return res.send({products});
    }catch(error){
        return Erro(error, "Error updating " + textController + " by id");

    }
})

// DELETE

router.delete("/", async (req, res) => {
    try{

        const product = await Product.deleteMany({});
        
        const products = await Product.find();
        return res.send({products});
    }catch(error){
        return Erro(error, "Error deleting all " + textController);

    }
})

router.delete("/:productId", async (req, res) => {
    try{
        const productId = req.params.productId;

        const product = await Product.findByIdAndRemove(productId);
        
        const products = await Product.find();
        return res.send({products});
    }catch(error){
        return Erro(error, "Error deleting " + textController + " by id");

    }
})


// PRODUCTS LIST
export default app => app.use("/product", router);
