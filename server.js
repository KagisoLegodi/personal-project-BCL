const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = require('./path/to/your/firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://your-project-id.firebaseio.com' // Replace with your database URL
});

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Firebase Firestore instance
const db = admin.firestore();

// File Upload API endpoint
app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        const { originalname, buffer } = req.file;
        const pdfRef = db.collection('pdfs').doc();
        const uploadResult = await pdfRef.set({
            filename: originalname,
            content: buffer.toString('base64') // Convert buffer to base64 string
        });
        res.send('File uploaded successfully');
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
