require('dotenv').config();

const express = require('express');
const mongoose= require('mongoose');
const routes= require('./router');

const app = express();

app.use(express.json())
app.use('/api', routes)

//connection mongodb
mongoose.connect(process.env.DB_CONNECTION_STRING,{
  useNewUrlParser:true,
  useUnifiedTopology: true,
})


const database = mongoose.connection

database.on('error' , (err)=> console.log(err))

database.on("connected",()=> console.log("database connected"))

app.listen(3000, ()=>{
  console.log("Server started  on localhost:3000");
})

