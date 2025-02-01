require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const express = require('express');
const mongoose= require('mongoose');
const routes= require('./router/authRoutes');
const sellerRoutes= require('./router/sellerRoutes')
const productRoutes = require('./router/productRoutes');
 


const app = express();

app.use(express.json())
app.use('/api', routes)
app.use('/api', sellerRoutes)
app.use('/api', productRoutes);

//connection mongodb
mongoose.connect(process.env.DB_CONNECTION_STRING,{
  useNewUrlParser:true,
  useUnifiedTopology: true,
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const database = mongoose.connection

database.on('error' , (err)=> console.log(err))

database.on("connected",()=> console.log("database connected"))

app.listen(3000, ()=>{
  console.log("Server started  on localhost:3000");
})

