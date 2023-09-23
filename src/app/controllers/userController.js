import express from "express";

import User from "../model/user.js";
import Product from "../model/product.js"

import ShoppingCar from "../model/shoppingcar.js";
import PaymentArea from "../model/paymentarea.js";
import Order from "../model/order.js";

import Orders from "../model/orders.js";

import { Erro } from "./function.js";

const textController = "User"

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

// router.use((_req, res, next) => {
//     // _req.userId = getUserId()
//     next();
// });

// GET

router.get("/", async (req, res) => {
    try{
        const users = await User.find();
        return res.send({users});
    }catch(error){
        return Erro(error, "Error getting all " + textController);
    }
})

router.get("/:userId", async (req, res) => {
    try{
        const userId = req.params.userId;

        const user = await User.findById(userId);
        return res.send({user});
    }catch(error){
        return Erro(error, "Error getting " + textController + " by id");
    }
})

// POST

router.post("/", async (req, res) => {
    try{
        const {name, email, password} = req.body;

        const user = await User.create({name, email, password});
        
        await user.save()
        
        const users = await User.find();
        return res.send({users});
    }catch(error){
        console.log(error);
        return Erro(error, "Error posting all " + textController);

    }
})

router.post("/all", async (req, res) => {
    try{

        const usersFromClientSide = req.body;

        await Promise.all(usersFromClientSide.map(async userFromClientSide => {
            const {name, email, password} = userFromClientSide;

            const user = await User.create({name, email, password});
        
            await user.save()
        }))
        
        const users = await User.find();
        return res.send({users});
    }catch(error){
        console.log(error);
        return Erro(error, "Error posting " + textController + " by id");

    }
})

// PUT

router.put("/", async (req, res) => {
    try{

        const usersFromClientSide = req.body;

        await Promise.all(usersFromClientSide.map(async userFromClientSide => {

            const {id, name, email, password} = userFromClientSide;

            const user = await User.findByIdAndUpdate(id, {name, email, password});
        
            await user.save()
        }))
        
        const users = await User.find();
        return res.send({users});
    }catch(error){
        console.log(error);
        return Erro(error, "Error updating all " + textController);

    }
})

router.put("/:userId", async (req, res) => {
    try{
        const userId = req.params.userId;
        
        const {name, email, password} = req.body;

        const user = await User.findByIdAndUpdate(userId, {name, email, password});
        
        const users = await User.find();
        return res.send({users});
    }catch(error){
        console.log(error);
        return Erro(error, "Error updating " + textController + " by id");

    }
})

// DELETE

router.delete("/", async (req, res) => {
    try{

        const user = await User.deleteMany({});
        
        const users = await User.find();
        return res.send({users});
    }catch(error){
        console.log(error);
        return Erro(error, "Error deleting all " + textController);

    }
})

router.delete("/:userId", async (req, res) => {
    try{
        const userId = req.params.userId;

        const user = await User.findByIdAndRemove(userId);
        
        const users = await User.find();
        return res.send({users});
    }catch(error){
        console.log(error);
        return Erro(error, "Error deleting " + textController + " by id");

    }
})

// PRODUCTS LIST
export default app => app.use("/user", router);
