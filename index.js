const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.te4s04i.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    const serviceCollection = client.db('geniusCar').collection('services');
    const orderCollection = client.db('geniusCar').collection('orders');


    app.get('/services', async(req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    });

    app.get('/services/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const services = await serviceCollection.findOne(query);
        res.send(services)
    });

    app.post('/orders', async(req, res)=>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.send(result);
    });

    // orders API
    app.get('/orders', async(req, res)=>{
        const query = {};
        const cursor = orderCollection.find(query);
        const orders = await cursor.toArray();
        res.send(orders);
    })


}
run().catch(err => console.error(err));







app.get('/', (req, res)=>{
    res.send('Genius car server is running');
});


app.listen(port, ()=>{
    console.log(`Genius Car server is running ${port}`);
})
