import express from "express";

import User from "../../model/user.js";
import Produto from "../../model/produto.js"

import ShoppingCar from "../../model/shoppingcar.js";
import PaymentArea from "../../model/paymentarea.js";
import Order from "../../model/order.js";

import Orders from "../../model/orders.js";

import { Erro } from "../function.js";

const router = express.Router();

router.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
});

async function getUserId(){
    if(global.userId !== undefined)
        global.userId = await User.find()[0]._id;
    return global.userId
}

router.use((_req, res, next) => {
    // _req.userId = getUserId()
    next();
});

router.get("/", async (req, res) => {
    try{
        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        return Erro(error, "Error loading  produto");
    }
})

// SHOPPING CAR

router.put("/shoppingcar/add/:produtoId", async (req, res) => {
    try{
        const produtoId = req.params.produtoId;
        const produto = await Produto.findById(produtoId);
        if(produto.quantidade > 0){
            produto.quantidade--;
            produto.noCarrinho++;
        }
        await produto.save();
        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        return Erro(error, "Error updating produto");
    }
})

router.put("/shoppingcar/remove/:produtoId", async (req, res) => {
    try{
        const produtoId = req.params.produtoId;
        const produto = await Produto.findById(produtoId);
        if(produto.noCarrinho > 0){
            produto.quantidade++;
            produto.noCarrinho--;
        }
        await produto.save();
        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        console.log(error);
        return res.status(400).send({erro: "Error updating produto"});
    }
})

router.put("/shoppingcar/delete/all", async (req, res) => {
    try{
        const produtos = await Produto.find();

        const listIdProducts = produtos.filter(produto => produto.noCarrinho > 0 ?? produto._id);

        await Promise.all(listIdProducts.map(async IdProduct => {
            const auxProduto = await Produto.findById(IdProduct)
            auxProduto.quantidade += auxProduto.noCarrinho;
            auxProduto.noCarrinho = 0;
            await auxProduto.save()
        }))

        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        console.log(error);
        return res.status(400).send({erro: "Error updating produto"});
    }
})

router.put("/shoppingcar/delete/:produtoId", async (req, res) => {
    try{
        const produtoId = req.params.produtoId;
        console.log(produtoId)
        const produto = await Produto.findById(produtoId);
        if(produto.noCarrinho > 0){
            produto.quantidade += produto.noCarrinho;
            produto.noCarrinho = 0;
        }
        await produto.save();
        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        console.log(error);
        return res.status(400).send({erro: "Error updating produto"});
    }
})

// PAYMENT AREA

router.put("/paymentarea/add/all", async (req, res) => {
    try{
        const produtos = await Produto.find();
        
        const listIdProducts = produtos.filter(produto => produto.noCarrinho > 0 ?? produto._id);

        await Promise.all(listIdProducts.map(async IdProduct => {
            const auxProduto = await Produto.findById(IdProduct)
            auxProduto.emProcessoDePagamento += auxProduto.noCarrinho
            auxProduto.noCarrinho = 0
            await auxProduto.save()
        }))

        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        console.log(error);
        return res.status(400).send({erro: "Error updating produto"});
    }
})

router.put("/paymentarea/remove/all", async (req, res) => {
    try{
        const produtos = await Produto.find();
        
        const listIdProducts = produtos.filter(produto => produto.emProcessoDePagamento > 0 ?? produto._id);

        await Promise.all(listIdProducts.map(async IdProduct => {
            const auxProduto = await Produto.findById(IdProduct)
            auxProduto.noCarrinho = auxProduto.emProcessoDePagamento
            auxProduto.emProcessoDePagamento = 0
            await auxProduto.save()
        }))

        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        console.log(error);
        return res.status(400).send({erro: "Error updating produto"});
    }
})

// ORDERS

router.put("/orders/add/all", async (req, res) => {
    try{
        const produtos = await Produto.find();
        
        const listIdProducts = produtos.filter(produto => produto.emProcessoDePagamento > 0 ?? produto._id);

        await Promise.all(listIdProducts.map(async IdProduct => {
            const auxProduto = await Produto.findById(IdProduct)
            auxProduto.NosPedidos += auxProduto.emProcessoDePagamento
            auxProduto.emProcessoDePagamento = 0
            await auxProduto.save()
        }))

        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        console.log(error);
        return res.status(400).send({erro: "Error updating produto"});
    }
})

router.put("/orders/status/:produtoId", async (req, res) => {
    try{
        const produtoId = req.params.produtoId;
        const {status} = req.body;

        console.log(produtoId, status)

        const produto = await Produto.findById(produtoId);
        
        produto.status = status;

        await produto.save();

        const products = await Produto.find();

        console.log(products.filter(p => p.NosPedidos > 0)[0].status)

        return res.send({products});
    }catch(error){
        console.log(error);
        return res.status(400).send({erro: "Error updating produto"});
    }
})

// PRODUCTS LIST

router.post("/", async (req, res) => {
    try{
        const {nome, preco, quantidade} = req.body;

        const produto = await Produto.create({nome, preco, quantidade});
        await produto.save()
        
        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        console.log(error);
        return res.status(400).send({erro: "Error creating new produto"})

    }
})

router.put("/:produtoId", async (req, res) => {
    try{
        const produtoId = req.params.produtoId;
        const {nome, preco, quantidade} = req.body;

        const produto = await Produto.findByIdAndUpdate(produtoId, {nome, preco, quantidade});
        
        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        console.log(error);
        return res.status(400).send({erro: "Error creating new produto"})

    }
})

router.delete("/:produtoId", async (req, res) => {
    try{
        const produtoId = req.params.produtoId;

        const produto = await Produto.findByIdAndRemove(produtoId);
        
        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        console.log(error);
        return res.status(400).send({erro: "Error creating new produto"})

    }
})

export default app => app.use("/produto", router);
