import express from "express";

import { Erro } from "./function.js";

const textController = "Test"

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
        const test = {"nome": "Teste"};
        return res.send({test});
    }catch(error){
        return Erro(error, "Error getting all " + textController);
    }
})

export default app => app.use("/test", router);
