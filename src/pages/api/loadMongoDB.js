import fs from "fs";
import path from "path";
import clientPromise from "../../lib/mondodb.js";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("MUF_2023");

    const days = await db.collection("days").find({}).toArray();
    let dataString = JSON.stringify(days);
    dataString = dataString.replace(/"([^"]+)":/g, "$1:"); // Remove quotes around keys
    dataString = `export const Data = ${dataString};`;

    fs.writeFileSync(path.resolve("./src/Data/data.js"), dataString); // This saves data into new file that Chart.js can read

    res.json(days);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};
