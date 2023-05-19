const express = require('express');
const mongoose = require('mongoose');
const route = require('./src/routes/route')

const app = express();
require('dotenv').config();
app.use(express.json());

mongoose.connect(process.env.mongo_url, {
    useNewUrlParser:true
})
.then(()=>console.log('Database is connected'))
.catch(err=> console.log(err))
app.use('/', route)
app.listen(process.env.PORT, ()=>{
    console.log('Server is running')
})
