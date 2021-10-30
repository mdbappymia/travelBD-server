const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iuevi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();

    const database = client.db("travel-bangladesh");
    const serviceCollection = database.collection("serviceCollection");
    const bookingCollection = database.collection("bookingCollection");
    const agentCollection = database.collection("agentCollection");
    // get all item from database
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.json(result);
    });

    // get single item
    app.get("/services/:id", async (req, res) => {
      const serviceId = req.params.id;

      const result = await serviceCollection.findOne({
        _id: ObjectId(serviceId),
      });
      res.json(result);
    });
    // post a single item to database
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result);
    });
    // delete a single service from database
    app.delete("/services/:id", async (req, res) => {
      const serviceId = req.params.id;
      const query = { _id: ObjectId(serviceId) };
      const result = await serviceCollection.deleteOne(query);
      res.json(result);
    });

    // post user booking
    app.post("/booking", async (req, res) => {
      const bookingItem = req.body;
      const result = await bookingCollection.insertOne(bookingItem);
      res.json(result);
    });
    // get all booking item
    app.get("/booking", async (req, res) => {
      const email = req.params.email;

      const result = await bookingCollection.find({}).toArray();
      res.json(result);
    });
    // get booking item selected user
    app.get("/booking/:email", async (req, res) => {
      const email = req.params.email;

      const result = await bookingCollection
        .find({ email: { $eq: email } })
        .toArray();
      console.log(result);
      res.json(result);
    });

    // delete a booking item using id
    app.delete("/booking/:id", async (req, res) => {
      const bookingId = req.params.id;
      const query = { _id: ObjectId(bookingId) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });

    // approved the status
    app.put("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: data,
      };
      const result = await bookingCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // find all agent information
    app.get("/agents", async (req, res) => {
      const result = await agentCollection.find({}).toArray();
      res.json(result);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello node server");
});
app.listen(port, () => {
  console.log("Server is running on port", port);
});
