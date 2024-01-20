import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017/MUF_2023";
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const client = new MongoClient(uri, options);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const anomalies = req.body;

    // Create a new MongoClient for each request
    const client = new MongoClient(uri, options);

    // Connect to MongoDB and update anomalies
    await client.connect();
    const db = client.db("MUF_2023");

    // Loop through each anomaly
    for (let anomaly of anomalies) {
      // Extract the muf and time values
      const { muf, time } = anomaly;

      // Convert time to a Date object, потому что Time со страницы имеет формат String.
      const timeAsDate = new Date(time);

      // Find a matching record in the "days" collection
      const matchingRecord = await db
        .collection("days")
        .findOne({ muf, time: timeAsDate });

      // If a matching record is found, insert it into the "Anomalies" collection
      // If a matching record is found, check if it already exists in the "Anomalies" collection
      if (matchingRecord) {
        const existingAnomaly = await db
          .collection("Anomalies")
          .findOne({ muf, time: timeAsDate });

        // If it doesn't exist, insert it into the "Anomalies" collection
        if (!existingAnomaly) {
          await db.collection("Anomalies").insertOne(matchingRecord);
        }
      }
    }

    // Close the connection to the database
    await client.close();

    res.status(200).json({ message: "Anomalies updated" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
