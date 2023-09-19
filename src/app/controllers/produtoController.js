import express from "express";

import Produto from "../model/produto.js"

const router = express.Router();

router.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
});

router.get("/", async (req, res) => {
    try{
        const products = await Produto.find();
        return res.send({products});
    }catch(error){
        console.log(error);
        return res.status(400).send({erro: "Error loading  produto"});
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
        console.log(error);
        return res.status(400).send({erro: "Error updating produto"})
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

// router.get("/", async (req, res) => {
//     try{

//         const produtos = await Produto.find();
        
//         return res.send({produtos});

//     }catch(error){

//         console.log(error);

//         return res.status(400).send({erro: "Error loading  produto"})

//     }
// })

// router.get("/:produtoId", async (req, res) => {
//     try{

//         const produtos = await Produto.findById(req.params.produtoId);
        
//         return res.send({produtos});

//     }catch(error){

//         console.log(error);
//         return res.status(400).send({erro: "Error loading  produto"})

//     }
// })

// router.post("/", async (req, res) => {

//     const {nome, preco, quantidade} = req.body;

//     try{

//         const produto = await Produto.create({nome, preco, quantidade});
        
//         return res.send({produto});

//     }catch(error){

//         console.log(error);

//         return res.status(400).send({erro: "Error creating new produto"})

//     }
// })

// router.put("/", async (req, res) => {

//     const {nome, preco, quantidade} = req.body;

//     try{

//         const produto = await Produto.findByIdAndUpdate(req.params.produtoId, {nome, preco, quantidade}, {new: true});
        
//         return res.send({produto});

//     }catch(error){

//         console.log(error);

//         return res.status(400).send({erro: "Error updating produto"})

//     }
// })

// router.put("/:produtoId", async (req, res) => {

//     const {nome, preco, quantidade} = req.body;

//     try{

//         const produto = await Produto.findByIdAndUpdate(req.params.produtoId, {nome, preco, quantidade}, {new: true});
        
//         return res.send({produto});

//     }catch(error){

//         console.log(error);

//         return res.status(400).send({erro: "Error updating produto"})

//     }
// })

// router.put("/all/", async (req, res) => {

//     // const {nome, preco, quantidade} = req.body;

//     try{

//         // console.log(req.body)

//         const listProductsFromClientSide = req.body

//         if(listProductsFromClientSide){

//             await Produto.deleteMany();
    
//             await Promise.all(listProductsFromClientSide.map(async (product) => {

//                 const {nome, preco, quantidade} = product;

//                 const auxProduct = new Produto({nome, preco, quantidade})

//                 await auxProduct.save()

//             }))
            
//             const products = await Produto.find();
        
//             return res.send(products);

//         }
        
//         return res.send(listProductsFromClientSide);

//     }catch(error){

//         console.log(error);

//         return res.status(400).send({erro: "Error updating produto"})

//     }
// })


// router.delete("/:produtoId", async (req, res) => {
//     try{

//         await Produto.findByIdAndRemove(req.params.produtoId);
        
//         const produtos = await Produto.find();
        
//         return res.send({produtos});

//     }catch(error){

//         console.log(error);
//         return res.status(400).send({erro: "Error loading  produto"})

//     }
// })



// import authMiddlewares from "../old/middlewares/auth.js";

// router.use(authMiddlewares);

// import produto from "../model/produto.js"
// import Task from "../model/task.js"




    // try{

    //     // console.log(req.body)

    //     const listProductsFromClientSide = req.body

    //     if(listProductsFromClientSide){

    //         await Produto.deleteMany();
    
    //         await Promise.all(listProductsFromClientSide.map(async (product) => {

    //             const {nome, preco, quantidade} = product;

    //             const auxProduct = new Produto({nome, preco, quantidade})

    //             await auxProduct.save()

    //         }))
            
    //         const products = await Produto.find();
        
    //         return res.send(products);

    //     }
        
    //     return res.send(listProductsFromClientSide);

    // }catch(error){

    //     console.log(error);

    //     return res.status(400).send({erro: "Error updating produto"})

    // }