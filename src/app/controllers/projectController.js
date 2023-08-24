import express from "express";
// import User from "../model/user.js";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";
// import authConfig from "../config/auth.json" assert { type: "json" };
import authMiddlewares from "../middlewares/auth.js";

import Project from "../model/project.js"
import Task from "../model/task.js"

const router = express.Router();

router.use(authMiddlewares);

router.get("/", async (req, res) => {
    try{
        const projects = await Project.find().populate(["user", "tasks"]);
        
        console.log("oi");
        return res.send({projects});
    }catch(error){
        console.log(error);
        console.log("oi");
        return res.status(400).send({erro: "Error loading  project"})
    }
})

router.get("/:projectId", async (req, res) => {
    try{
        const projects = await Project.findById(req.params.projectId).populate(["user", "tasks"]);
        
        console.log("oi");
        return res.send({projects});
    }catch(error){
        console.log(error);
        console.log("oi");
        return res.status(400).send({erro: "Error loading  project"})
    }
})

router.post("/", async (req, res) => {
    const {title, description, tasks} = req.body;
    try{
        const project = 
            await Project.create(
                { title, description, user: req.userId}
            );
        
        if(tasks){
            await Promise.all(tasks.map(async task => {
                const projectTask = new Task({ ...task, project: project._id, assignedTo: req.userId})
    
                await projectTask.save();
                project.tasks.push(projectTask)
            }))

            await project.save();
        }
        
        console.log("oi");
        return res.send({project});
    }catch(error){
        console.log(error);
        console.log("oi");
        return res.status(400).send({erro: "Error creating new project"})
    }
})

router.put("/:projectId", async (req, res) => {
    const {title, description, tasks} = req.body;
    try{
        const project = 
            await Project.findByIdAndUpdate(
                req.params.projectId,
                { 
                    title, 
                    description
                },
                {new: true}
            );

        project.tasks = []

        await Task.deleteMany({project: project._id})
        
        if(tasks){
            await Promise.all(tasks.map(async task => {
                const projectTask = new Task({ ...task, project: project._id, assignedTo: req.userId})
    
                await projectTask.save();
                project.tasks.push(projectTask)
            }))

            await project.save();
        }
        
        console.log("oi");
        return res.send({project});
    }catch(error){
        console.log(error);
        console.log("oi");
        return res.status(400).send({erro: "Error updating project"})
    }
})

router.delete("/:projectId", async (req, res) => {
    try{
        await Project.findByIdAndRemove(req.params.projectId);
        
        const projects = await Project.find().populate("user");
        
        console.log("oi");
        return res.send({projects});
    }catch(error){
        console.log(error);
        console.log("oi");
        return res.status(400).send({erro: "Error loading  project"})
    }
})

export default app => app.use("/projects", router);