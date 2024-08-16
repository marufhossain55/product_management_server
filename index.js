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
