import { v4 } from "uuid"; // Import UUID package for generating unique IDs
import { DataAPIClient } from "@datastax/astra-db-ts";
require('dotenv').config();
// Initialize the client
const client = new DataAPIClient(
  process.env.DataApiClient_Token
);
const db = client.db(
  process.env.AstraDB_Url
);

// Alternative function to handle index-related errors
async function handleIndexError(collectionName) {
  console.log("Handling the TOO_MANY_INDEXES error...");
  // Define your alternative logic here, e.g., reduce the number of indexes

  try {

    const colls = await db.listCollections();
    console.log("coolsss",colls[0].name)
    const ok = await db.dropCollection(colls[0].name);
    console.log("okkkkkkkkk",ok)

    const collection = await db.createCollection(collectionName, {
      vector: {
        dimension: 1536,
        metric: "cosine",
        sourceModel: "other",
      },
    });
    console.log("Successfully created collection:", collection.name);
  } catch (error) {
    console.error("Failed to create collection in alternative function:", error.message);
  }
}



// 
function generateUniqueCollectionName(prefix = "yo") {
  const currentDate = new Date();
  let formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
  let formattedTime = currentDate.toISOString().slice(11, 19).replace(/:/g, "");
  const uniqueId = v4().split("-")[0];
  const datee = `${prefix}_${formattedDate}${formattedTime}_${uniqueId}`
  console.log(datee)
  return datee;
}
//

(async () => {


  const collectionName = generateUniqueCollectionName()
  const colls = await db.listCollections();
  console.log("Connected to AstraDB:", colls[0].options.indexing);

  try {
    const collection = await db.createCollection(collectionName, {
      vector: {
        dimension: 1536,
        metric: "cosine",
        sourceModel: "other",
      },
    });
    console.log("Successfully created collection:", collectionName);
  } catch (error) {
    if (error.errorDescriptors[0].errorCode.includes("TOO_MANY_INDEXES")) {
      console.error("Error: Too many indexes.");
      await handleIndexError(collectionName); // Call the alternative function
    } else {
      console.error("An unexpected error occurred:", error.message);
    }
  }

  const colls2 = await db.listCollections();
  console.log("Updated collections:", colls2);
})();
