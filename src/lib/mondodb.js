import { MongoClient } from "mongodb";

// URI to your MongoDB
const uri = "mongodb://127.0.0.1:27017/MUF_2023";

// Options for the MongoDB client
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client = new MongoClient(uri, options);
let clientPromise = client.connect();

export default clientPromise;
