const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// database connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fv0po6o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const coffeesCollection = client.db("coffeeDB").collection("coffees");
    const usersCollection = client.db("coffeeDB").collection("users");

    // GET all coffees
    app.get("/coffees", async (req, res) => {
      const result = await coffeesCollection.find().toArray();
      res.send(result);
    });

    // GET one coffee dynamically
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    });

    // POST a coffee
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeesCollection.insertOne(newCoffee);
      res.send(result);
    });

    // PUT a coffe (updating a coffee)
    app.put("/coffees/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true }; // optional, only use if you want to insert if not exists
        const updatedCoffee = req.body;

        const updatedDoc = {
          $set: updatedCoffee,
        };

        const result = await coffeesCollection.updateOne(
          filter,
          updatedDoc,
          options
        );

        res.send(result); // result contains matchedCount, modifiedCount
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to update coffee" });
      }
    });

    // DELETE a coffee
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    });

    // user related APIs
    app.post("/users", async (req, res) => {
      const userProfile = req.body;
      console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    });
    // ===================
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to DB Successfully");
  } catch (err) {
    console.error(err);
  } finally {
    // don't close client here, otherwise connection ends
  }
}
run().catch(console.dir);

// root route
app.get("/", (req, res) => {
  res.send("Coffee Server Running...");
});

// start server
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});
