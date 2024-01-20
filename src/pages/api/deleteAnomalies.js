import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017/MUF_2023";
const options = { useNewUrlParser: true, useUnifiedTopology: true };

export default async function handler(req, res) {
  if (req.method === "POST") {
    const anomaliesToDelete = req.body;

    // Create a new MongoClient for each request, потому что запросы могут не отправляться
    const client = new MongoClient(uri, options);

    // Connect to MongoDB and get anomalies.
    // Можно сделать как-то через встраиваемый элемент, но у меня никак не получается.
    await client.connect();
    const db = client.db("MUF_2023");

    // Loop through each anomaly to delete
    for (let anomaly of anomaliesToDelete) {
      // Extract the muf and time values
      const { muf, time } = anomaly;

      // Convert time to a Date object, потому что при сравнении Time со страницы имеет формат String.
      const timeAsDate = new Date(time);

      // Delete the matching record in the "Anomalies" collection
      await db.collection("Anomalies").deleteOne({ muf, time: timeAsDate });
    }

    // Close the connection to the database
    await client.close();

    res.status(200).json({ message: "Anomalies deleted" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
