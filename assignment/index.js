const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const { connectToDB , getdb } = require('./connection')
const runserver = http.createServer(app)
const { login , register , logout } = require('./userAPI')
const { createTask , getTask , updateTask , deleteTask , finished } = require('./tasksAPI')
const PORT = process.env.PORT || 8000
//connect
let db
connectToDB((err)=> {
    if(!err){
        runserver.listen(PORT , ()=> console.log('server is running'))
        db = getdb()
    }
})
//middleware
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname , 'static')))
//API routes
app.post('/api/user/login' , login)
app.post('/api/user/logout' , logout)
app.post('/api/user/register' , register)
app.post('/api/task/create' , createTask)
app.get('/api/task/get' , getTask)
app.delete('/api/task/delete' , deleteTask)
app.put('/api/task/update', updateTask)
app.patch('/api/task/finished' , finished)
//website routes
app.get('/' , (req , res) => {
    res.sendFile(path.join(__dirname , 'views' , 'login_page.html'))
})
app.get('/register' , (req , res)=> {
    res.sendFile(path.join(__dirname , 'views' , 'register_page.html'))
})
app.get('/homepage' , (req , res)=> {
    res.sendFile(path.join(__dirname , 'views' , 'task.html'))
})