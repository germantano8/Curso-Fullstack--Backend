const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 3000;
const MONGO_URL = "mongodb+srv://germantano8:pNNqnNLbTNerShWb@cluster0.vakll.mongodb.net/curso_fullstack?retryWrites=true&w=majority";

const app = express();
const router = require('./src/routes/index.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(router);

const connectDb = async () => {
    try{
        await mongoose.connect(MONGO_URL);
        console.log('Database connected');
        
        app.listen({port: PORT}, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }catch(error){
        console.log(`Error connecting to database: ${error}`);
    }
}

connectDb();