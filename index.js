const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 9000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
  Credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.va5jejf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const productCollection = client
      .db('productManagement')
      .collection('products');

    app.get('/products', async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    // get all job data from db for pagination
    app.get('/all-products', async (req, res) => {
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page) - 1;
      const result = await productCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    //get all job data count from db
    app.get('/products-count', async (req, res) => {
      const count = await productCollection.countDocuments();
      res.send({ count });
    });

    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('hello from product Management');
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
