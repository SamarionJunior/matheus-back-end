import express from "express";

import User from "../model/user.js";
import Product from "../model/product.js"

import ShoppingCar from "../model/shoppingcar.js";
import PaymentArea from "../model/paymentarea.js";
import Order from "../model/order.js";

import Orders from "../model/orders.js";

import { Erro } from "./function.js";

const textController = "Order"

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
        const order = await Orders.find().populate('userId').populate('productId').populate("groupId")
        // .sort({date: -1})
        // .populate('userId').populate('productId').populate("groupId");
        return res.send({order});
    }catch(error){
        return Erro(error, "Error getting all " + textController);
    }
})

// router.get("/", async (req, res) => {
//     try{
        
//         const orderproducts = await Order.find();
//         const orderproductsid = orderproducts.map(orderproduct => orderproduct._id.toString());
        
//         const orders = [];
//         // const a = {a:0};
        
//         await Promise.all(orderproductsid.map(async orderproductid => {
//             const orderAux = await Orders.find({groupId: orderproductid})
//             // orders[orderproductid] = orderAux;
//             // const aux = a.a;
//             orders.push({[orderproductid]: orderAux});
//             // a.a++;
//         }));
//         // .populate('userId').populate('productId');
//         return res.send({orders});
//     }catch(error){
//         return Erro(error, "Error getting all " + textController);
//     }
// })

// POST

router.post("/", async (req, res) => {
    try{
        const userId = req.userId;
        const productsFromPaymentArea = await PaymentArea.find();
            
        const orderss = await Order.create({});
        const orderId = orderss._id.toString();

        await Promise.all(productsFromPaymentArea.map(async productFromPaymentArea => {
            const productId = productFromPaymentArea.productId.toString();

            const orders = await Orders.create({userId: userId, productId: productId, groupId: orderId, quantidade: productFromPaymentArea.quantidade});
            await PaymentArea.deleteMany({userId: userId, productId: productId});
            await orders.save();
        }))
        
        const order = await Orders.find().populate('userId').populate('productId').populate("groupId");
        return res.send({order});
    }catch(error){
        return Erro(error, "Error updating all " + textController);
    }
})


router.post("/all", async (req, res) => {
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

router.put("/status", async (req, res) => {
    try{
        const userId = req.userId;

        const groupId = req.body.id;
        const status = req.body.status;
            
        await Order.findById(groupId).then(async order => {
            order.status = status;
            await order.save();
        });
        
        const order = await Orders.find().populate('userId').populate('productId').populate("groupId")
        // .populate('userId').populate('productId');
        return res.send({order});
    }catch(error){
        return Erro(error, "Error updating all " + textController);
    }
})

router.put("/reset", async (req, res) => {
    try{
        const userId = req.userId;
        const productsFromPaymentArea = await PaymentArea.find();
            
        const order = await Order.create({});
        const orderId = order._id.toString();

        await Promise.all(productsFromPaymentArea.map(async productFromPaymentArea => {
            const productId = productFromPaymentArea.productId.toString();

            const orders = await Orders.create({userId: userId, productId: productId, groupId: orderId, quantidade: productFromPaymentArea.quantidade});
            await PaymentArea.deleteMany({userId: userId, productId: productId});
            await orders.save();
        }))
        
        const orders = await Orders.find();
        // .populate('userId').populate('productId');
        return res.send({orders});
    }catch(error){
        return Erro(error, "Error updating all " + textController);
    }
})

// DELETE


router.delete("/", async (req, res) => {
    try{
        const userId = req.userId;
        // const productsFromOrders = await Orders.find();
        
        await Orders.find({userId: userId})
            .then(async orders => {
                if(orders !== null && orders?.length !== 0){
                    await Promise.all(orders.map(async order => {
                        if(order !== null && order?.length !== 0){
                            await Product.findById(order.productId.toString())
                                .then(async product => {
                                    if(product !== null && product?.length !== 0){
                                        product.quantidade += order.quantidade;
                                        await product.save();
                                    }
                                });
                        }
                    }))
                }
            });

        await Order.deleteMany({userId: userId});

        await Orders.deleteMany({userId: userId});

        const order = await Orders.find({userId: userId})
        // .populate('userId').populate('productId');
        return res.send({order});
    }catch(error){
        return Erro(error, "Error deleting all " + textController);
    }
})


export default app => app.use("/order", router);


        
        // const order = await Order.find();

        // await Promise.all(order.map(async o => {
        //     const groupId = o._id.toString();

        //     const products = await Orders.find({groupId: groupId});

        //     await Promise.all(products.map(async product => {
        //         const productId = product.productId.toString();

        //         const itemFromPaymentArea = await PaymentArea.find({productId: productId});


        //         if(itemFromPaymentArea !== null && itemFromPaymentArea.length){
        //             console.log(itemFromPaymentArea)
        //             itemFromPaymentArea[0].quantidade += product.quantidade;
        //             await itemFromPaymentArea[0].save()
        //         }else{
        //             const paymentarea = await PaymentArea.create({userId: userId, productId: productId, quantidade: product.quantidade});
        //             await paymentarea.save()
        //         }
        //     }))

        //     await Orders.deleteMany({groupId: groupId});
        // }))

        // await Order.deleteMany({});

        // const list = productsFromOrders.map(p => p._id.toString());

        // await Promise.all(productsFromOrders.map(async productFromOrders => {
        //     const orders = productFromOrders._id.toString();

        //     const productId = productFromOrders.productId.toString();
            
        //     const itemFromPaymentArea = await PaymentArea.findOne({productId: productId});

        //     if(itemFromPaymentArea !== null){
        //         itemFromPaymentArea.quantidade += productFromOrders.quantidade;
        //         await itemFromPaymentArea.save()
        //     }else{
        //         const paymentarea = await PaymentArea.create({userId: userId, productId: productId, quantidade: productFromOrders.quantidade});
        //         await paymentarea.save()
        //         const verify = await PaymentArea.find({userId: userId, productId: productId});
        //         console.log("Verify");
        //         console.log(verify);
        //     }
        //     await Orders.deleteMany({_id: orders});
        // }))
        