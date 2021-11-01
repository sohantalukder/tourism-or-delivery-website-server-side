const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zsdqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("sweetTravel");
        const servicesCollections = database.collection("services");

        const database2 = client.db("sweetTravel");
        const servicesOrders = database2.collection("myOrder");

        app.get('/services', async (req, res) => {

            const cursor = servicesCollections.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        app.post('/services', async (req, res) => {
            console.log(req.body)
            const service = req.body;
            const result = await servicesCollections.insertOne(service);
            res.json(result)
        });

        //myOrder items

        app.get('/myOrder', async (req, res) => {
            const cursor = servicesOrders.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        app.post('/myOrder', async (req, res) => {
            console.log(req.body);
            const service = req.body;
            const result = await servicesOrders.insertOne(service);
            res.json(result)
        })

        //single item identify for my order
        app.get('/myOrder/:email', async (req, res) => {
            console.log(req.params.email);

            const result = await servicesOrders.find({ email: req.params.email }).toArray();
            res.json(result);
        })

        //delete 

        app.delete('/myOrder/:id', async (req, res) => {
            console.log(req.params.id)
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesOrders.deleteOne(query);
            res.json(result);

        })


    }
    finally {
    }
}
run().catch(console.dir);

//

app.get('/', (req, res) => {
    res.send('Running Sweet server')
});

app.listen(port, () => {
    console.log('Running Sweet server', port);
})