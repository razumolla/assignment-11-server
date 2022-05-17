const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phe4r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        console.log('db connect');

        const productCollection = client.db("carDealer").collection("products");

        // send data to server from client
        app.post("/addpd", async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result)
        })
        // get all product 
        app.get("/product", async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })
        //get one product to > Product Details
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query);
            res.send(product)
        })
        // DELETE from manage car service
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })




    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Buy Your Dream Car!')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})