import { DataAPIClient } from "@datastax/astra-db-ts";
import { v4 as uuidv4 } from "uuid"; // Import UUID package for generating unique IDs
import dotenv from "dotenv";
dotenv.config();


async function handleIndexError(db, collectionName) {
  console.log("Handling the TOO_MANY_INDEXES error...");
  try {
    const colls = await db.listCollections();
    // console.log("Existing collections:", colls);

    if (colls.length > 0) {
      console.log(`Deleting collection: ${colls[0].name}`);
      const ok0 = await db.dropCollection(colls[0].name);
      const ok1 = await db.dropCollection(colls[1].name);
      const ok2 = await db.dropCollection(colls[2].name);
      console.log(
        `Collection ${colls[0].name},${colls[1].name},${colls[2].name} deleted successfully.`
      );
    } else {
      console.log("No collections to delete.");
    }

    const collection = await db.createCollection(collectionName, {
      vector: {
        dimension: 1536,
        metric: "cosine",
        sourceModel: "other",
      },
    });
    console.log("Successfully created collection:", collectionName);
    return true; // Collection successfully created
  } catch (error) {
    console.error("Failed to handle TOO_MANY_INDEXES error:", error.message);
    return false; // Failed to handle the error
  }
}

export async function createAstraCollection(collectionName) {
  try {
    // Initialize the client
    const client = new DataAPIClient(process.env.DataApiClient_Token);
    const db = client.db(process.env.AstraDB_Url);

    // List existing collections
    const colls = await db.listCollections();
    // console.log("Connected to AstraDB:", colls);

    // Attempt to create the collection
    try {
      const collection = await db.createCollection(collectionName, {
        vector: {
          dimension: 1536,
          metric: "cosine",
          sourceModel: "other",
        },
      });
      console.log("Successfully created collection:", collection.name);
      return true; // Collection successfully created
    } catch (error) {
      if (
        error.errorDescriptors &&
        error.errorDescriptors[0]?.errorCode.includes("TOO_MANY_INDEXES")
      ) {
        console.error("Error: Too many indexes.");
        const result = await handleIndexError(db, collectionName); // Call the alternative function
        return result; // Return the result from the alternative handler
      } else {
        console.error("An unexpected error occurred:", error.message);
        return false; // Unexpected error
      }
    }
  } catch (error) {
    console.error("Critical failure in createAstraCollection:", error.message);
    return false; // Critical failure
  }
}

// name genereator
export function generateUniqueCollectionName(prefix = "yo") {
  const currentDate = new Date();
  let formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
  let formattedTime = currentDate.toISOString().slice(11, 19).replace(/:/g, "");
  const uniqueId = uuidv4().split("-")[0];
  const datee = `${prefix}_${formattedDate}${formattedTime}_${uniqueId}`;
  console.log(datee);
  return datee;
}


