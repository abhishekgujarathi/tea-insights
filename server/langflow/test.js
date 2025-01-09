async function handleIndexError(db, collectionName) {
  console.log("Handling the TOO_MANY_INDEXES error...");
  try {
    const colls = await db.listCollections();
    console.log("Existing collections:", colls);

    if (colls.length > 0) {
      console.log(`Deleting collection: ${colls[0].name}`);
      const ok0 = await db.dropCollection(colls[0].name);
      const ok1 = await db.dropCollection(colls[1].name);
      const ok2 = await db.dropCollection(colls[2].name);
      console.log(`Collection ${colls[0].name} deleted successfully.`);
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
    console.log("Successfully created collection:", collection.name);
  } catch (error) {
    console.error("Failed to handle TOO_MANY_INDEXES error:", error.message);
  }
}

async function createAstraCollection(collectionName) {
  try {
    // Initialize the client
    const client = new DataAPIClient(
      process.env.DataApiClient_Token
    );
    const db = client.db(
      process.env.AstraDB_Url
    );

    // List existing collections
    const colls = await db.listCollections();
    console.log("Connected to AstraDB:", colls);

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
    } catch (error) {
      if (
        error.errorDescriptors &&
        error.errorDescriptors[0]?.errorCode.includes("TOO_MANY_INDEXES")
      ) {
        console.error("Error: Too many indexes.");
        await handleIndexError(db, collectionName); // Call the alternative function
      } else {
        console.error("An unexpected error occurred:", error.message);
      }
    }

    // Log updated collections
    const updatedColls = await db.listCollections();
    console.log("Updated collections:", updatedColls);
  } catch (error) {
    console.error("Critical failure in createAstraCollection:", error.message);
  }
}
