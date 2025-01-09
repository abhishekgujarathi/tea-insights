import express from 'express';
import multer, { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import session from 'express-session';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Compute __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
console.log(__file)
const __dirname = dirname(__filename);  // Now it's correctly imported

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Make sure we handle JSON body parsing properly

// Session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure: true if using HTTPS
  })
);

// Generate unique collection name
function generateUniqueCollectionName(prefix = "yo") {
  const currentDate = new Date();
  let formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
  let formattedTime = currentDate.toISOString().slice(11, 19).replace(/:/g, "");
  const uniqueId = uuidv4().split("-")[0];
  const datee = `${prefix}_${formattedDate}${formattedTime}_${uniqueId}`
  console.log(datee)
  return datee;
}

// Multer setup for file storage
const file_storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where files will be stored
  },
  filename: (req, file, cb) => {
    const name = generateUniqueCollectionName();
    const csvName = `${name}.csv`;
    req.session.collectionName = name; // Store the generated name in the session
    cb(null, csvName); // Set the file name in the callback
    console.log(csvName); // Log the generated CSV file name
  },
});

const file_upload = multer({ file_storage });

// Route to handle file upload
app.post('/upload', file_upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Retrieve the collectionName from session
  const uploadedName = req.session.collectionName;
  res.status(200).send({
    message: "File Uploaded Successfully!",
    file: req.file,
    sessionCollectionName: uploadedName, // Send collection name to frontend
  });

  
});



app.post('/fetch-file', (req, res) => {
  const sessionCollectionName = req.session.collectionName;
console.log(sessionCollectionName);
  if (!sessionCollectionName) {
    return res.status(400).send({ message: 'No file session found. Please upload a file first.' });
  }

  const filePath  = `./uploads/${sessionCollectionName}.csv`;
  // = path.join(__dirname, 'uploads', `${sessionCollectionName}.csv`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return res.status(500).send({ message: 'Error reading the file' });
    }

    res.status(200).send({ fileContent: data });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
