const express = require('express')
const mongoose = require ('mongoose')
const cors = require('cors')

const routes = require ('./Routes/routes')

const cookieParser=require ('cookie-parser')

const app= express()


app.use (cors({
    credentials : true ,
    origin : ['http://localhost:4200']
}))
app.use (cookieParser())
app.use (express.json())

app.use ("/api",routes)
mongoose.connect("mongodb://127.0.0.1:27017/projetPi",{
    useNewUrlParser : true

    
})
.then(()=> {
    console.log ("connected to database !!")

app.listen(5000,()=>{
        console.log("app is listening on port 5000")
    })
})