import {Request, Response} from 'express'
import {generateToken} from '../middlewares/auth.js'
import User from '../models/user.js'
import { IUser } from '../types/types.js'
import { paginator } from '../middlewares/helpers.js'

async function createUser(req: Request, res: Response){
    const userData: IUser= req.body.data// modify
    try{
        const newUser: IUser= await User.create(userData)
        res.status(201).json(newUser)
    }catch(e){
        res.status(500).json({'err': e.message})
    }
}

async function loginUser(req: Request, res: Response){
    const {email, password}= req.body
    try{
        const user: IUser= await User.login(email, password)
        const token: String= generateToken(user._id, user.role)
        res.status(200).json({"Token":token, user})
    }catch(e){
        res.status(500).json(e)
    }
}

async function getUser(req: Request, res: Response){
    const uid: string= req.params.id
    try{
        const findUser: IUser= await User.findById(uid).select("-updatedAt -__v -password")
        findUser? 
            res.status(200).json({findUser}) 
        : 
            res.status(404).json({"err": "no user was found"})
    }catch(e){
        res.status(500).json(e)
    }
}

async function getAllUsers(req: Request, res: Response){
    try{
        const limit: number= paginator(req)
        await User.find().select("-password").limit(limit)
        .then(allUsers=> res.status(200).json({allUsers}))
    }catch(e){
        res.status(500).json(e)
    }
}

async function updateUser(req: Request, res: Response){
    const uid: string= req.params.id
    try{
        const userData: IUser= req.body.data
        await User.updateOne({_id: uid}, userData)
        .then(()=> res.status(201).json({"msg": "User Updated Successfully"}))
        .catch((e: Error)=> res.status(500).json(e))
    }catch(e){
        res.status(500).json(e)
    }
}

async function deleteUser(req: Request, res: Response){
    const uid: string= req.params.id
    try{
        await User.findByIdAndDelete(uid)
        res.status(200).json({'msg': 'User Deleted successfully'})
    }catch(e){
        res.status(500).json(e)
    }
}

export {createUser, loginUser, getUser, getAllUsers, updateUser, deleteUser}