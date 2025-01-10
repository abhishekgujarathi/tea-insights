import express from "express";
import multer, { diskStorage } from "multer";
import session from "express-session";
import cors from "cors";
import fs from "fs";
import langflow_sujal from "./langflow/langflow_api_sujal.js";
import csvParser from "csv-parser";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Readable } from "stream";
import {
  createAstraCollection,
  generateUniqueCollectionName,
} from "./utils.js";

import {
  langFlowAskQuestion,
  callLangFlowAsk as langFlowAsk,
  callMain,
} from "./langflow_utils.js";

import dotenv from "dotenv";
dotenv.config(); // Load environment variables

// Correctly initialize base_filename and base_dirname
// const base_filename = __filename; // Full path to the current file
// const base_dirname = __dirname; // Directory name of the current file

// Universal solution to get __filename and __dirname
// const isESM = typeof __filename === "undefined"; // Check if running in ESM

// const base_filename = isESM
//   ? fileURLToPath(import.meta.url) // ESM way
//   : __filename; // CommonJS way

// const base_dirname = isESM
//   ? dirname(fileURLToPath(import.meta.url)) // ESM way
//   : __dirname; // CommonJS way

const app = express();

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:5174",
//       "http://192.168.1.12:5173",
//     ], // React app origin
//     credentials: true, // Allow cookies to be sent
//   })
// );

app.use(
  cors({
    origin: true,
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookie in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// ----------------- multer setup-------------------------------------

const file_upload = multer({
  storage: multer.memoryStorage(), // Store the file in memory as a Buffer
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10 MB
  },
  fileFilter: (req, file, cb) => {
    // Optional: Validate file type (e.g., only allow CSV)
    if (file.mimetype !== "text/csv") {
      return cb(new Error("Invalid file type. Only CSV files are allowed."));
    }
    cb(null, true);
  },
});

// ----------------- multer setup-------------------------------------

// ----------------- routes -------------------------------------

// ----------- session create
app.get("/", (req, res) => {
  console.log("home", req.session);
  res.send("working").status(200);
});

app.get("/test-session-set", (req, res) => {
  // Generate a collection name if it doesn't already exist in the session
  const sessionCollectionName =
    req.body.collectionName || generateUniqueCollectionName();

  // Respond with the collection name
  return res.status(200).json({ collectionName: sessionCollectionName });
});

// ---------- Upload Endpoint
app.post("/upload", file_upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded." });
    }

    // Access the JSON data from the formData (it was appended as a string)
    const jsonData = JSON.parse(req.body.jsonData); // Parse the JSON string
    console.log("json", jsonData);

    // Access the file content directly from the buffer
    const dataString = req.file.buffer.toString("utf-8"); // Convert buffer to string

    // Check for empty data
    if (!dataString) {
      return res.status(400).send({ error: "Empty file content." });
    }

    // Check for missing collection name in the session
    const collectionName = jsonData.collectionName; // Assuming collectionName is stored in session
    console.log("Session Collection Name:", collectionName);

    // If collection name is found in session
    if (collectionName) {
      await createAstraCollection(collectionName);

      // Call a function (e.g., callMain) with the file content and collection name
      const result = await callMain(dataString, collectionName);

      // Send a success response with file content and processing result
      return res.status(200).send({
        success: true,
        message: `Processing completed successfully with collection: ${collectionName}`,
        result: result, // Optionally include the processing result
        collectionName: collectionName,
        fileContent: dataString, // Include file content in the response
        jsonData: jsonData, // Include the JSON data in the response
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
  let collectionName = req.body.collectionName || "NONE";
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
  const sessionCollectionName = req.body.collectionName;

  if (!sessionCollectionName) {
    return res
      .status(400)
      .send({ message: "No file session found. Please upload a file first." });
  }

  // Access CSV data directly from req.body
  const csvData = req.body.fileContent; // Expecting the CSV data as a raw string in req.body.csvData

  if (!csvData) {
    return res
      .status(400)
      .send({ message: "No CSV data provided in request." });
  }

  const results = [];
  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;
  const postTypeTotals = {};

  // Convert the CSV string into a readable stream
  const csvStream = Readable.from(csvData);

  csvStream
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
        message: "CSV data processed successfully!",
        fileContent: results, // Send the parsed rows as JSON
        totalLikes,
        totalComments,
        totalShares,
        postTypeTotals, // Grouped totals by post_type
      });
    })
    .on("error", (streamError) => {
      console.error("Error processing the CSV data:", streamError);
      res.status(500).send({ message: "Error processing the CSV data" });
    });
});
// ----------------- routes -------------------------------------

app.post("/fetch", async (req, res) => {
  console.log("fetch - ", req.body);

  const sessionCollectionName = req.body.collectionName || "NONE";
  console.log("Right now collection: ", sessionCollectionName);

  const questionTOAsk = req.body.input;

  if (!questionTOAsk) {
    return res.status(400).json({ error: "Input is invalid or missing." });
  }
  console.log("Right now collection 2: ", sessionCollectionName);

  if (sessionCollectionName) {
    try {
      const result = await langFlowAskQuestion(
        questionTOAsk,
        sessionCollectionName
      );
      console.log("Right now collection 3: ", sessionCollectionName);

      if (result && result.success) {
      console.log("Right now collection 4: ", sessionCollectionName);
        return res.status(200).json({
          success: true,
          message: `Processing completed successfully with collection: ${sessionCollectionName}`,
          result: result.result,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Error processing request.",
        });
      }
    } catch (error) {
      console.error("Error in /fetch route:", error);

      // Check if the error message is JSON parsable
      try {
        const parsedError = JSON.parse(error.message);
        return res.status(400).json({ error: parsedError });
      } catch (parsingError) {
        return res.status(500).send({
          error: "An unexpected error occurred.",
          message: error.message,
        });
      }
    }
  } else {
    // If collection name is not found in the request body
    return res
      .status(400)
      .json({ error: "Collection name is missing or invalid." });
  }
});

// Start the server

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
