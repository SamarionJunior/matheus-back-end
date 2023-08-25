import express from "express";

import Produto from "../model/produto.js"

const router = express.Router();

router.get("/", async (req, res) => {
    try{

        const produtos = await Produto.find();
        
        return res.send({produtos});

    }catch(error){

        console.log(error);

        return res.status(400).send({erro: "Error loading  produto"})

    }
})

router.get("/:produtoId", async (req, res) => {
    try{

        const produtos = await Produto.findById(req.params.produtoId);
        
        return res.send({produtos});

    }catch(error){

        console.log(error);
        return res.status(400).send({erro: "Error loading  produto"})

    }
})

router.post("/", async (req, res) => {

    const {nome, preco, quantidade} = req.body;

    try{

        const produto = await Produto.create({nome, preco, quantidade});
        
        return res.send({produto});

    }catch(error){

        console.log(error);

        return res.status(400).send({erro: "Error creating new produto"})

    }
})

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

router.put("/all/", async (req, res) => {

    // const {nome, preco, quantidade} = req.body;

    try{

        // console.log(req.body)

        const listProductsFromClientSide = req.body

        if(listProductsFromClientSide){

            await Produto.deleteMany();
    
            await Promise.all(listProductsFromClientSide.map(async (product) => {

                const {nome, preco, quantidade} = product;

                const auxProduct = new Produto({nome, preco, quantidade})

                await auxProduct.save()

            }))
            
            const products = await Produto.find();
        
            return res.send(products);

        }
        
        return res.send(listProductsFromClientSide);

    }catch(error){

        console.log(error);

        return res.status(400).send({erro: "Error updating produto"})

    }
})

router.delete("/:produtoId", async (req, res) => {
    try{

        await Produto.findByIdAndRemove(req.params.produtoId);
        
        const produtos = await Produto.find();
        
        return res.send({produtos});

    }catch(error){

        console.log(error);
        return res.status(400).send({erro: "Error loading  produto"})

    }
})

export default app => app.use("/produto", router);

// import authMiddlewares from "../old/middlewares/auth.js";

// router.use(authMiddlewares);

// import produto from "../model/produto.js"
// import Task from "../model/task.js"