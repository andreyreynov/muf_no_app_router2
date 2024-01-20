import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017/MUF_2023";
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Create a new MongoClient for each request, потому что запросы могут не отправляться
    const client = new MongoClient(uri, options);

    // Connect to MongoDB and get anomalies.
    // Можно сделать как-то через встраиваемый элемент, но у меня никак не получается.
    await client.connect();
    const db = client.db("MUF_2023");

    // Получить все записи Anomalies в массив. В методичке также написано.
    const anomalies = await db.collection("Anomalies").find().toArray();

    // Close the connection to the database
    await client.close();

    // Send the anomalies as the response
    res.status(200).json(anomalies);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
