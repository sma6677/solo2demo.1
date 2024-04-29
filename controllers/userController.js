import UserModel from "../models/userModel.js";


export async function getAllUsers(req, res){
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export async function getUserByID(req, res){
    try {
        const users = await UserModel.findById(req.params.id);
        if (!users) {
            res.status(404).json({message: 'User not found'});
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export async function createUser(req, res){
    try {
        const newUser = new UserModel({
            name: req.body.name,
            username: req.body.username || ' ',
            password: req.body.password || ' '
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export async function login(req, res){
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({username});
        if (!user || user.password !== password){
            return res.status(401).json({message: 'Invalid Username or password'});
        }
        res.stats(user);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}