const express = require('express')
const app = express()
const { connectToDB , getdb } = require('./connection')
const { hashSync , compareSync } = require('bcryptjs')
let db
connectToDB((err) => {
    if(err){
        return
    }
    db = getdb()
})
const register = async (req , res) => {
    try{
        const { username , password , confirmPassword } = req.body
        if(!username || !password || !confirmPassword) return res.status(400).json({'message':'insert all the required data'})
        if(password !== confirmPassword) return res.status(400).json({'message':'passwords does not match'})
        const user = await db.collection('users').findOne({username})
        if(user){
            return res.status(400).json({'message':'username already exists'})
        }
        const hashedPass = hashSync(password , 10)
        await db.collection('users').insertOne({username ,password: hashedPass , isActive: true})
        return res.status(201).json({'message':'user was created successfully'})
    }catch(err){
        return res.status(500).json({'message':'something went wrong'})
    }
}

const login = async (req , res) => {
    try{
        const { username , password } = req.body
        if(!username || !password) return res.status(400).json({'message':'insert all the required information'})
        const user = await db.collection('users').findOne({username})
        if(!user) return res.status(404).json({'message': 'user is not found'})
        const isValid = compareSync(password , user.password)
        if(!isValid) return res.status(400).json({'meesage':'username or password is incorrect'})
        await db.collection('users').updateOne({username}, {$set:{isActive: true}})
        if(req.cookies.username)res.clearCookie("username")
        res.cookie("username" , username , {httpOnly: true})
        return res.status(200).json({'message': 'user has logged in successfully'})
    }catch(err){
        res.status(500).json({'message': 'something went wrong'})
    }
}

const logout = async (req , res) => {
    try{
        const username = req.cookies.username
        if(!username) return res.status(400).json({'message': 'user is not logged in'})
        await db.collection('users').updateOne({username} , {$set:{isActive: false}})
        res.clearCookie("username")
        return res.status(200).json({'message': 'user has logged out successfully'})
    }catch(err){
        return res.status(500).json({'message':'something went wrong'})
    }
}

module.exports = {
    register,
    login,
    logout
}