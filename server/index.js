import express from "express";
import multer, { diskStorage } from "multer";
import session from "express-session";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import langflow_sujal from "./langflow/langflow_api_sujal.js";
import csvParser from "csv-parser";

import {
  createAstraCollection,
  generateUniqueCollectionName,
} from "./utils.js";

import { callLangFlowAsk as langFlowAsk, callMain } from "./langflow_utils.js";

import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const __filename = __filename || path.join(__dirname, path.basename(process.argv[1]));
const __dirname = __dirname || path.dirname(__filename);


const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://192.168.1.12:5173",
    ], // React app origin
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
      secure: false, // TODO: Set to true for HTTPS
    },
  })
);

// ----------------- multer setup-------------------------------------

// Ensure the "uploads" folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads directory created.");
}

// Multer setup for file storage
const file_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Setting file destination...");
    cb(null, uploadDir); // Folder where files will be stored
  },
  filename: (req, file, cb) => {
    console.log("Setting file name...");
    const name = req.session.collectionName;
    const csvName = `${name}.csv`;
    req.session.collectionName = name; // Store the generated name in the session
    cb(null, csvName); // Set the file name in the callback
    console.log(`Generated file name: ${csvName}`);
  },
});

// Create multer instance
const file_upload = multer({ storage: file_storage });

// ----------------- multer setup-------------------------------------

// ----------------- routes -------------------------------------

// ----------- session create
app.get("/", (req, res) => {
  res.send("working").status(200);
});

app.get("/test-session-set", (req, res) => {
  // Generate a collection name if it doesn't already exist in the session
  const sessionCollectionName =
    req.session.collectionName || generateUniqueCollectionName();

  // Store the collection name in the session
  req.session.collectionName = sessionCollectionName;

  // Respond with the collection name
  return res.status(200).json({ collectionName: sessionCollectionName });
});

// ---------- Upload Endpoint
app.post("/upload", file_upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path; // File path where the file was saved
    console.log(`File saved at: ${filePath}`);

    // Read the file content from the disk
    const dataString = fs.readFileSync(filePath, "utf-8"); // Read file content as string

    // Check for empty data
    if (!dataString) {
      return res.status(400).send({ error: "Empty data" });
    }

    // Access the collection name from the session
    const collectionName = req.session.collectionName;
    console.log("Session Collection Name:", collectionName);

    if (collectionName) {
      await createAstraCollection(collectionName);

      // Call a function (e.g., callMain) with the file content and collection name
      const result = await callMain(dataString, collectionName);

      // Send a success response
      return res.status(200).send({
        success: true,
        message: `Processing completed successfully with collection: ${collectionName}`,
        result: result, // Optionally include the result
        collectionName: collectionName,
      });
    } else {
      // Handle missing session data
      return res
        .status(400)
        .send({ error: "Collection name not found in session." });
    }
  } catch (error) {
    console.error("Error processing file:", error);
    return res.status(500).json({
      message: "Error processing file",
      error: error.message,
    });
  }
});

// TODO: baki che aakhu
// --------------- get summary endpoint
app.get("/question-choice", async (req, res) => {
  let collectionName = req.session.collectionName;

  if (collectionName) {
    try {
      const result = await langFlowAsk(
        "highest engagement post from the data",
        req.session.collectionName
      );

      // Send a success response with the result of langFlowAsk
      return res.status(200).send({
        success: true,
        message: `Processing completed successfully with collection: ${req.session.collectionName}`,
        result: result, // Optionally send the result of the callLangFlowAsk function
      });
    } catch (error) {
      console.error("Error in /question-choice route:", error);
      return res.status(400).send({ error: error.message });
    }
  } else {
    // If collection name is not found in session
    return res
      .status(400)
      .send({ error: "Collection name not found in session." });
  }
});

// Start -------------------------Get Summery ------------------

app.post("/get-summery", async (req, res) => {
  let collectionName = req.session.collectionName || "NONE";
  console.log("right now collection summary : ", collectionName);

  // return res.status(200).send({
  //   success: true,
  //   message: `Processing completed successfully with collection: ${collectionName}`,
  //   result: `To determine the highest engagement, we need to define a metric for engagement.  A simple and common method is to sum the likes, comments, and shares.  Let's calculate that for each post and find the maximum.

  // Here are the top contenders based on likes + comments + shares:

  // * **post_6:** 419 + 499 + 139 = 1057
  // * **post_13:** 974 + 238 + 110 = 1322
  // * **post_16:** 954 + 136 + 100 = 1190
  // * **post_98:** 999 + 214 + 28 = 1241

  // Therefore, **post_13** has the highest engagement with a score of 1322
  // To determine the highest engagement, we need to define a metric for engagement.  A simple and common method is to sum the likes, comments, and shares.  Let's calculate that for each post and find the maximum.

  // Here are the top contenders based on likes + comments + shares:

  // * **post_6:** 419 + 499 + 139 = 1057
  // * **post_13:** 974 + 238 + 110 = 1322
  // * **post_16:** 954 + 136 + 100 = 1190
  // * **post_98:** 999 + 214 + 28 = 1241

  // Therefore, **post_13** has the highest engagement with a score of 1322`
  // });

  if (collectionName) {
    try {
      const result = await langFlowAsk(
        "highest engagement post from the data", // get summery question
        collectionName
      );
      // console.log("Bitch", collectionName)

      if (result && result.success) {
        console.log("my result : ", result);
        return res.status(200).send({
          success: true,
          message: `Processing completed successfully with collection: ${collectionName}`,
          result: result.result, // Optionally send the result
        });
      } else {
        return res.status(400).send({
          success: false,
          message: `Error processing request.`,
        });
      }
    } catch (error) {
      console.error("Error in /question-choice route:", error);
      return res.status(400).send({ error: error.message });
    }
  } else {
    // If collection name is not found in session
    return res
      .status(400)
      .send({ error: "Collection name not found in session." });
  }
});

// End -------------------------Get Summery ------------------

app.post("/fetch-file", (req, res) => {
  const sessionCollectionName = req.session.collectionName;
  // const sessionCollectionName = "yo_20250109165848_83e6f6fe";

  console.log(sessionCollectionName);
  if (!sessionCollectionName) {
    return res
      .status(400)
      .send({ message: "No file session found. Please upload a file first." });
  }

  const filePath = `./uploads/${sessionCollectionName}.csv`;

  const results = [];
  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;
  const postTypeTotals = {};

  // Parse the CSV file into JSON and calculate sums
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      results.push(row);
      // Calculate total likes, comments, shares
      totalLikes += parseInt(row.likes, 10) || 0;
      totalComments += parseInt(row.comments, 10) || 0;
      totalShares += parseInt(row.shares, 10) || 0;

      // Grouping by post_type
      const postType = row.post_type;
      if (!postTypeTotals[postType]) {
        postTypeTotals[postType] = { likes: 0, comments: 0, shares: 0 };
      }
      postTypeTotals[postType].likes += parseInt(row.likes, 10) || 0;
      postTypeTotals[postType].comments += parseInt(row.comments, 10) || 0;
      postTypeTotals[postType].shares += parseInt(row.shares, 10) || 0;
    })
    .on("end", () => {
      // Prepare the response with file content as JSON and the totals
      res.status(200).send({
        message: "File processed successfully!",
        fileContent: results, // Send the parsed rows as JSON
        totalLikes,
        totalComments,
        totalShares,
        postTypeTotals, // Grouped totals by post_type
      });
    })
    .on("error", (streamError) => {
      console.error("Error processing the file:", streamError);
      res.status(500).send({ message: "Error processing the file" });
    });
});

// ----------------- routes -------------------------------------

app.post("/fetch", async (req, res) => {
  // const { input } = req.body;
  // console.log(req.body)
  // // return res.send(req.body);
  // if (!input) {
  //   return res.status(400).json({ error: "Input invalid" });
  // }

  // console.log(req.body)

  // try {
  //   const response = await langflow_sujal(input);
  //   console.log(response);
  //   res.status(200).json({ userData: response });
  // } catch (error) {
  //   console.error("Error fetching data:", error.message);
  //   res.status(500).json({ error: "Failed to fetch data from external API" });
  // }
  // -----------------------
  let collectionName = req.session.collectionName || "NONE";

  console.log("right now collection : ", collectionName);
  console.log("right now question : ", req.body.input);

  const questionTOAsk = req.body.input;

  if (collectionName) {
    try {
      const result = await langFlowAsk(questionTOAsk, collectionName);
      // console.log("Bitch", collectionName)

      if (result && result.success) {
        console.log("my result : ", result);
        return res.status(200).send({
          success: true,
          message: `Processing completed successfully with collection: ${collectionName}`,
          result: result.result, // Optionally send the result
        });
      } else {
        return res.status(400).send({
          success: false,
          message: `Error processing request.`,
        });
      }
    } catch (error) {
      console.error("Error in /question-choice route:", error);
      return res.status(400).send({ error: error.message });
    }
  } else {
    // If collection name is not found in session
    return res
      .status(400)
      .send({ error: "Collection name not found in session." });
  }
});

// Start the server

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
