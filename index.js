const express = require('express')
require("dotenv").config();
const app = express()
const port = 3000
const cors = require('cors');


app.use(cors());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // collectin name
        const itemsCollection = client.db('testPagination').collection('items');


        // apis

        app.get('/items', async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            const skip = (page - 1) * limit;

            const items = await itemsCollection.find().skip(skip).limit(limit).toArray();
            const totalItems = await itemsCollection.countDocuments();

            res.status(200).json({
                message: "welcome you successfully retrive the data",
                page,
                limit,
                totalItems,
                totalpages: Math.ceil(totalItems / limit),
                data: items
            })
        })
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
