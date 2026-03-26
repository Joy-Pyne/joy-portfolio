const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory (portfolio 1)
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for handling contact form submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    console.log('--- New Contact Form Submission ---');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------------');

    // In a real application, you would send an email or save to a database here
    
    // Send success response
    res.status(200).json({ success: true, message: 'Message received successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running beautifully at http://localhost:${PORT}`);
});
