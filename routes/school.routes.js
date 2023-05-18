import express from "express"
import { SchoolModel } from "../model/school.model.js";

const schoolRouter = express.Router();

schoolRouter.get("/", async (req, res) => {
        try {
            const schools =  await SchoolModel.find()
            
            

        return res.status(201).json(schools);
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
});

export {schoolRouter}