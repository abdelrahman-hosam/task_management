const express = require('express')
const app = express()
const { connectToDB , getdb } = require('./connection')
const uuid = require('uuid')
let db
connectToDB((err) => {
    if(err){
        return
    }
    db = getdb()
})

const create_tokens = () => {
    const delete_id = uuid.v4()
    const update_id = uuid.v4()
    return {delete_id , update_id}
}

const createTask = async(req , res) => {
    try{
        const { title , des , due_date } = req.body
        const username = req.cookies.username
        if(!username) return res.status(401).json({'message': 'You do not have premission to do this action'})
        if(!title || !des || !due_date) return res.status(400).json({'message':'insert all the required data'})
        const { delete_id , update_id } = create_tokens()
        await db.collection('tasks').insertOne({title , des , due_date , isDone: false , username , delete_id , update_id})
        return res.status(201).json({'message': 'task was created successfully'})
    }catch(err){
        return res.status(500).json({'message': 'something went wrong'})
    }
}

const getTask = async(req , res) => {
    try{
        const username = req.cookies.username
        if(!username) return res.status(401).json({'message': 'You do not have premission to do this action'})
        const tasks = await db.collection('tasks').find({username}).project({_id: 0 , username: 0}).toArray()
        return res.status(200).json({'message':'tasks were retrieved successfully' , 'tasks':tasks})
    }catch(err){
        return res.status(500).json({'message': 'something went wrong'})
    }
}

const deleteTask = async(req , res) => {
    try{
        const username = req.cookies.username
        const delete_id = req.body.delete_id
        if(!username) return res.status(401).json({'message': 'You do not have premission to do this action'})
        if(!delete_id) return res.status(400).json({"message":"insert all the required inforamtion"})
        const task = await db.collection('tasks').findOne({delete_id:delete_id})
        if(!task || task.username !== username)return res.status(400).json({"message":"task does not exist or user do not have permission to do this action"})
        await db.collection('tasks').deleteOne({delete_id:delete_id})
        return res.status(200).json({"message": "task was deleted successfully"})
    }catch(err){
        return res.status(500).json({'message': 'something went wrong'})
    }
}

const updateTask = async(req , res) => {
    try{
        const username = req.cookies.username
        const { newTitle , newDes , newDueDate , update_id } = req.body
        if(!username) return res.status(401).json({'message': 'You do not have premission to do this action'})
        if(!update_id) return res.status(400).json({"message":"insert all the required inforamtion"})
        const task = await db.collection('tasks').findOne({update_id:update_id})
        if(!task || task.username !== username)return res.status(400).json({"message":"task does not exist or user do not have permission to do this action"})
        const title = newTitle? newTitle:task['title'],
              des = newDes? newDes:task['des'],
              due_date = newDueDate? newDueDate:task['due_date']
        await db.collection('tasks').updateOne({update_id} , {$set: {title , des , due_date}})
        return res.status(200).json({'message':'task was updated successfully'})
    }catch(err){
        return res.status(500).json({'message': 'something went wrong' , "error":err})
    }
}

const finished = async(req , res) => {
    try{
        const username = req.cookies.username
        const update_id = req.body.update_id
        let done
        if(!username) return res.status(401).json({'message': 'You do not have premission to do this action'})
        if(!update_id) return res.status(400).json({"message":"insert all the required inforamtion"})
        const task = await db.collection('tasks').findOne({update_id:update_id})
        if(!task || task.username !== username)return res.status(400).json({"message":"task does not exist or user do not have permission to do this action"})
        done = task.isDone? false:true
        await db.collection('tasks').updateOne({update_id} , {$set: {isDone: done}})
        return res.status(200).json({'message': 'task was updated successfully'})
    }catch(err){
        return res.status(500).json({'message': 'something went wrong'})
    }
}

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTask,
    finished
}