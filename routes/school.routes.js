import express from "express"
import { SchoolModel } from "../model/school.model.js";

const schoolRouter = express.Router();

schoolRouter.get("/", async (req, res) => {
        try {
            let schools =  await SchoolModel.find()    
            if (req.query.full){
                schools = await SchoolModel.find().populate("users", "-passwordHash -schools -posts -school").sort("name")
            }

        return res.status(201).json(schools);
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
});

export {schoolRouter}