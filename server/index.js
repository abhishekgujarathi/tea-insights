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

import { callLangFlowAsk as langFlowAsk, callMain } from "./langflow_utils.js";

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
    origin: true, // Allow all origins
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
      secure: true, // TODO: Set to true for HTTPS
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
  console.log("home",req.session)
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
    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded." });
    }

    // Access the file content directly from buffer
    // const dataString = req.file.buffer.toString("utf-8"); // Convert buffer to string

    const dataString = `post_id,likes,comments,shares,post_date,post_time,views,post_type
    1,1,203,122,09-06-2023,18:11:57,4438,carousel
    2,240,197,130,06-02-2023,12:42:53,8436,post
    3,484,216,217,18-06-2023,21:13:25,6592,post
    4,952,305,78,14-08-2022,01:24:49,7165,carousel
5,485,228,296,13-11-2022,02:43:00,4503,carousel
6,419,499,139,04-11-2023,16:43:44,8477,carousel
7,353,106,294,24-04-2022,07:53:13,2859,carousel
8,849,365,104,03-12-2023,16:10:30,6396,reel
9,647,226,195,20-07-2023,11:35:16,1542,post
10,86,499,84,28-09-2023,04:16:22,8282,post
11,123,245,110,05-05-2022,10:12:45,3568,carousel
12,412,198,90,18-08-2023,13:35:22,4537,post
13,598,323,150,29-09-2022,19:47:30,5032,carousel
14,901,405,100,25-12-2022,21:05:11,7210,reel
15,745,280,180,14-01-2023,14:17:35,6598,post
16,312,147,70,11-03-2023,11:27:48,2765,carousel
17,265,190,95,08-07-2022,08:34:55,3950,post
18,810,430,250,17-10-2022,20:14:31,7384,reel
19,562,310,140,21-02-2023,17:25:12,5873,post
20,452,200,100,03-09-2023,09:18:23,4890,carousel
21,612,325,190,22-05-2022,15:32:44,6534,carousel
22,789,480,220,30-10-2022,16:42:13,7245,carousel
23,214,130,80,07-04-2023,07:55:20,2987,post
24,943,550,260,19-08-2023,20:30:18,8543,reel
25,768,400,230,02-06-2023,11:45:33,6599,carousel
26,412,220,120,13-12-2022,14:22:17,4580,post
27,315,145,85,26-03-2023,10:05:49,3278,post
28,984,510,290,08-11-2023,19:14:06,8702,reel
29,674,330,170,18-07-2023,16:38:52,6049,carousel
30,523,290,150,27-01-2023,12:29:45,4780,post
31,854,460,200,09-09-2023,21:00:30,7342,carousel
32,715,400,180,06-02-2022,18:15:41,6543,post
33,198,125,75,20-06-2023,09:23:54,3157,post
34,630,350,210,04-08-2022,22:30:11,5728,reel
35,947,505,280,15-11-2022,20:40:26,8930,carousel
36,512,270,160,01-01-2023,13:45:38,4869,post
37,329,210,110,23-03-2023,15:50:49,3284,carousel
38,714,370,200,12-07-2023,19:55:32,6487,reel
39,852,490,250,31-10-2023,22:05:44,7358,carousel
40,436,225,140,28-04-2022,11:22:30,4693,post
41,890,540,300,06-06-2023,21:15:47,8156,reel
42,398,190,95,11-09-2022,16:48:12,4210,carousel
43,705,375,220,13-11-2023,20:32:08,6397,post
44,923,495,270,07-07-2023,23:45:16,8645,carousel
45,628,340,190,10-03-2023,13:50:42,5832,reel
46,314,165,100,15-05-2022,14:12:56,3528,carousel
47,742,400,230,02-10-2022,19:25:34,7032,reel
48,817,480,270,27-12-2022,22:45:09,7510,carousel
49,519,290,150,06-06-2023,10:05:38,5079,post
50,394,190,90,25-08-2023,14:35:22,4223,carousel
51,850,550,290,30-12-2023,21:15:43,8147,reel
52,365,190,110,12-04-2023,16:23:38,4530,post
53,719,375,220,18-06-2022,22:45:49,6348,carousel
54,982,500,300,14-11-2022,23:05:17,8925,carousel
55,401,210,130,29-01-2023,10:18:30,4798,post
56,730,390,250,19-07-2023,20:30:44,6879,reel
57,563,320,190,03-08-2022,19:05:28,5436,carousel
58,218,130,90,11-09-2023,15:50:39,3247,post
59,880,510,300,05-10-2023,22:30:14,7530,carousel
60,482,240,140,22-03-2023,13:45:45,5017,post`;

    // Check for empty data
    if (!dataString) {
      return res.status(400).send({ error: "Empty file content." });
    }

    // Access the collection name from the session
    const collectionName = req.session;
    console.log("Session Collection Name:", collectionName);
    return res
      .status(200)
      .json({ dataString: dataString, sessionn: collectionName });

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
