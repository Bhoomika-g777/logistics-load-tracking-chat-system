const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const correctPin = "1234";

// API to authenticate PIN
app.post("/auth", (req, res) => {
    const { pin } = req.body;
    if (pin === correctPin) {
        res.json({ success: true, message: "Authentication successful!" });
    } else {
        res.status(401).json({ success: false, message: "Incorrect PIN!" });
    }
});

// API to get predefined question suggestions
app.get("/suggestions", (req, res) => {
    const query = req.query.q.toLowerCase();
    if (!query) return res.json([]);

    const filtered = predefinedQuestions.filter(q => q.toLowerCase().includes(query));
    res.json(filtered);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "load.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});