const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 9000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const corsOptions = {
  origin: ['http://localhost:5173'],
  // origin: ['https://productmanagement-21a2f.web.app'],
  Credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
// app.use(cors());
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
      const filter = req.query.filter;
      const brandFilter = req.query.brandFilter;
      const sort = req.query.sort;
      const search = req.query.search;
      const priceFilter = req.query.priceFilter;
      let query = { title: { $regex: search, $options: 'i' } };
      //   if (filter) query = { category: filter };
      switch (priceFilter) {
        case 'bellow 200':
          query.price = { $lte: 200 };
          break;
        case '200-1000':
          query.price = { $gte: 200, $lte: 1000 };
          break;
        case 'upper 1000':
          query.price = { $gte: 1000 };
          break;
        default:
        // code block
      }
      if (filter) query.category = filter;
      if (brandFilter) query.brand = brandFilter;
      let options = {};
      //   if (sort) options = { sort: { price: sort === 'asc' ? 1 : -1 } };
      switch (sort) {
        case 'dsc':
          options.sort = { price: -1 };
          break;
        case 'asc':
          options.sort = { price: 1 };
          break;
        case 'dasc':
          options.sort = { creation_date: -1 };
          break;
        default:
        // code block
      }

      const result = await productCollection
        .find(query, options)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    //get all job data count from db
    app.get('/products-count', async (req, res) => {
      const filter = req.query.filter;
      const search = req.query.search;
      const brandFilter = req.query.brandFilter;
      const priceFilter = req.query.priceFilter;
      console.log(priceFilter);

      let query = { title: { $regex: search, $options: 'i' } };
      //   if (filter) query = { category: filter };
      if (filter) query.category = filter;
      if (brandFilter) query.brand = brandFilter;

      switch (priceFilter) {
        case 'bellow 200':
          query.price = { $lte: 200 };
          break;
        case '200-1000':
          query.price = { $gte: 200, $lte: 1000 };
          break;
        case 'upper 1000':
          query.price = { $gte: 1000 };
          break;
        default:
        // code block
      }
      const count = await productCollection.countDocuments(query);
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
