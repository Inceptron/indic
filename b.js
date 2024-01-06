const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3001;
const ipAddress = "192.168.43.76";

app.use(cors());

const connectionString =
  "mongodb+srv://inceptrondev:inceptrondev@cluster0.jqnygph.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(connectionString);

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });

app.get("/api/options", async (req, res) => {
  const db = client.db("naahar");
  const collection = db.collection("options");

  const data = await collection.find({}).toArray();
  res.json(data);
});

app.get("/api/products", async (req, res) => {
  const db = client.db("naahar");
  const collection = db.collection("products");

  const data = await collection.find({}).toArray();
  res.json(data);
});

app.get("/api/product", async (req, res) => {
  const db = client.db("naahar");
  const collection = db.collection("product");

  const data = await collection.find({}).toArray();
  res.json(data);
});

app.listen(port, ipAddress, () => {
  console.log("Server is running on port: http://" + ipAddress + ":" + port);
});
