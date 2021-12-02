const express = require('express');
const products = require('../data/products.json');
const bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

let databaseObject = {};
let productsCollectionObj = {};

const dbConnection = async () => {
    const uri = "mongodb+srv://germantano8:pNNqnNLbTNerShWb@cluster0.vakll.mongodb.net/curso_fullstack?retryWrites=true&w=majority";

    const client = new MongoClient(uri, {useUnifiedTopology: true});

    try{
        // Conectar el back con el cluster de MongoDB
        await client.connect();
        databaseObject = client.db("curso_fullstack");
        productsCollectionObj = databaseObject.collection("products");

        console.log("Cloud DB connected - Mongo DB");
    }catch(error){
        console.log(error);
    }
}

dbConnection().catch(console.error);

const mappedProducts = products.map((product) => {
    return {
        ...product,
        image: `http://localhost:${PORT}/img/${product.image}`
    }
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Recurso Producto

// Método get de productos

app.get('/products', async (req, res) => {
    try{
        const allProducts = await productsCollectionObj.find({}).toArray();
        res.status(200).send(allProducts);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
})

// Método get de productos por id

app.get('/products/:id', async (req, res) => {
    try{
        const product = await productsCollectionObj.findOne({
            id: req.params.id
        });

        if(!product){
            return res.status(404).send({
                message: `No se encontró el producto con id ${req.params.id}`,
            });
        }
        res.status(200).send(product);
    }catch(error){
        return res.status(500).send({
            message: `Ocurrió algún error durante la solicitud`,
            error: error,
        });
    }
})

// Método post de productos

app.post("/products", async (req, res) => {
    try{
        if(Object.keys(req.body).lenght === 0){
            return res.status(400).send({
                message: "No pudo añadirse el producto porque no existe body",
            });
        }

        const newProducto = {...req.body};

        await productsCollectionObj.insertOne(newProducto);
        res.status(200).send({
            message: "Se añadió exitosamente el producto",
        })
    }catch(error){
        return res.status(500).send({
            message: `Ocurrió algún error durante la solicitud`,
            error: error,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

// Método update de productos

app.put("/products/:id", async (req, res) => {
    try{
        if(Object.keys(req.body).lenght === 0){
            return res.status(400).send({
                message: "No pudo actualizar el producto porque no existe body",
            });
        }

        const product = await productsCollectionObj.findOne({
            id: req.params.id,
        });

        if(!product){
            return res.status(404).send({
                message: "No se encontró el producto",
            });
        }

        const newValue = {
            $set: {
                title: req.body.title,
                description: req.body.title,
                image: req.body.image,
                price: req.body.price
            }
        }

        const updateOne = await productsCollectionObj.updateOne({
            id:req.params.id
        }, 
        newValue);

        res.status(200).send({
            message: "Se actualizó exitosamente",
            product: updateOne,
        });
    }catch(error){
        return res.status(500).send({
            message: `Ocurrió algún error durante la solicitud`,
            error: error,
        });
    }
});

// Método delete de productos

app.delete("/products/:id", async (req, res) => {
    try{
        const productDeleteData = await productsCollectionObj.deleteOne({
            id: req.params.id,
        });

        if(!productDeleteData.deletedCount){
            return res.status(404).send({
                message: `No se pudo eliminar el producto con ID ${req.params.id}`,
            });
        }

        res.status(200).send(`El producto con ID ${req.params.id} fue eliminado`);
    }catch(error){
        return res.status(500).send({
            message: `Ocurrió algún error durante la solicitud`,
            error: error,
        });
    }
});