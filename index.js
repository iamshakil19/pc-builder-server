const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2tdxnuq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const productCollection = client.db("pc-builder").collection("products");
    const cpuCollection = client.db("pc-builder").collection("cpu");

    app.get("/products/:id", async (req, res) => {
        const {id} = req.params
        const query = { _id: new ObjectId(id) };
        console.log(query);
        const result = await productCollection.findOne(query)
        console.log(result);
        res.send(result);
      });

    app.get("/products", async (req, res) => {
      let filter = {};
      if (req.query && req.query.featured === "true") {
        filter = { featured: true };
      } else {
        filter = req.query
      }
      const result = await productCollection.find(filter).toArray();
      res.send(result);
    });



    app.post("/products", async (req, res) => {
      const result = await productCollection.insertOne(req.body);
      res.send(result);
    });


    app.get("/cpu", async (req, res) => {
      const result = await cpuCollection.find().toArray();
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running pc builder server");
});
app.listen(port, () => {
  console.log("pc builder app listening to port", port);
});
