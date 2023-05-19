import bcrypt from "bcrypt";
import express from "express";
import { generateToken } from "../config/jwt.config.js";
import { UserModel } from "../model/user.model.js";
import { SchoolModel } from "../model/school.model.js";

const SALT_ROUNDS = 10;

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      )
    ) {
      return res.status(400).json({
        msg: "Email ou senha invalidos. Verifique se ambos atendem as requisições.",
      });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);
    
    let school = await SchoolModel.findOneAndUpdate(
      { name: req.body.school }, 
      {$setOnInsert: {name:req.body.school}},
      { new : true, runValidators : true, upsert: true}
      );

    const createdUser = await UserModel.create({
      name: req.body.name,
      location: req.body.location,
      job: req.body.job,
      school: school._id,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      passwordHash: hashedPassword,
    });
     school = await SchoolModel.findOneAndUpdate(
      {_id:createdUser.school._id},
      {$push:{users: createdUser._id}},
      {new:true, runValidators:true}
    )


    
    const user = {
      ...createdUser._doc, 
      school:{
        _id: school._id,
        name: school.name
      }
    }

    delete createdUser._doc.passwordHash;
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "Email ou senha invalidos." });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = generateToken(user);

      const school = await SchoolModel.findById(
        user.school._id
      );
      const currentUser = {
        ...user._doc,
        school:{
          _id:school._id,
          name: school.name
        },
        token
      }

      delete user._doc.passwordHash;

      return res.status(200).json(currentUser);
    } else {
      return res.status(401).json({ msg: "Email ou senha invalidos." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export { userRouter };
