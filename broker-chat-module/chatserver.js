const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Hardcoded valid PIN for authentication
const correctPin = "1234";

// Sample load data
const availableLoads = {
    "12345": { status: "In Transit", location: "Chicago, IL", driver: "John Doe", estimatedArrival: "3 PM", paymentDue: "$1,200", invoiceStatus: "Pending", carrier: "XYZ Logistics" },
    "67890": { status: "Delivered", location: "Houston, TX", driver: "Jane Smith", estimatedArrival: "Completed", paymentDue: "$800", invoiceStatus: "Paid", carrier: "ABC Freight" },
    "54321": { status: "Delayed", location: "Denver, CO", driver: "Mike Johnson", estimatedArrival: "Tomorrow 10 AM", paymentDue: "$1,500", invoiceStatus: "Under Review", carrier: "LMN Transport" },
};

// Predefined Q/A responses
const hardcodedData = {
    "Load Management": {
        questions: [
            "Has my load been assigned a driver?",
            "What is the latest update on my shipment?",
            "Is my load delayed?",
            "Can I change the delivery location?"
        ],
        responses: {
            "Has my load been assigned a driver?": "Yes, your load is assigned to **Driver Mark Johnson**.",
            "What is the latest update on my shipment?": "Your shipment is currently **at the warehouse for pickup**.",
            "Is my load delayed?": "No, your load is **on schedule for delivery**.",
            "Can I change the delivery location?": "Yes, but **additional charges may apply**. Contact support for changes."
        }
    },
    "Payments & Settlements": {
        questions: [
            "When is my next payment scheduled?",
            "What are the payment terms for my account?",
            "Can I request an early settlement?",
            "What deductions are applied to my payments?"
        ],
        responses: {
            "When is my next payment scheduled?": "Your next payment is **scheduled for March 20, 2025**.",
            "What are the payment terms for my account?": "Payment terms are **Net-15** after delivery confirmation.",
            "Can I request an early settlement?": "Yes, early settlements are possible with a **2% processing fee**.",
            "What deductions are applied to my payments?": "Deductions include **fuel advances, toll charges, and fines if applicable**."
        }
    }
};

// General chatbot responses
const generalResponses = {
    "hello": "Hello! How can I assist you?",
    "hi": "Hi there! What do you need help with?",
    "who are you": "I am Rigbot, your virtual assistant.",
    "help": "Sure! You can select a category or type your question.",
    "thank you": "You're welcome!",
    "bye": "Goodbye! Have a great day!"
};

// Authentication endpoint (PIN verification)
app.post("/api/authenticate", (req, res) => {
    const { pin } = req.body;

    if (pin === correctPin) {
        res.json({ success: true, message: "Access granted!" });
    } else {
        res.status(401).json({ success: false, message: "Incorrect PIN!" });
    }
});

// Get load details by Load ID
app.get("/api/load/:loadId", (req, res) => {
    const { loadId } = req.params;

    if (availableLoads[loadId]) {
        res.json(availableLoads[loadId]);
    } else {
        res.status(404).json({ message: "Load not found!" });
    }
});

// Handle Q/A Portal responses
app.post("/api/qa", (req, res) => {
    const { question } = req.body;

    for (const category in hardcodedData) {
        if (hardcodedData[category].responses[question]) {
            return res.json({ response: hardcodedData[category].responses[question] });
        }
    }

    if (generalResponses[question.toLowerCase()]) {
        return res.json({ response: generalResponses[question.toLowerCase()] });
    }

    return res.json({ response: "I'm sorry, I don't have information on that. Please contact support." });
});

// Shipment Progress Simulation
const shipmentProgress = {
    "12345": ["Load assigned to carrier", "Pickup confirmed", "In transit", "Approaching destination", "Delivered successfully"],
    "67890": ["Carrier assigned, waiting for pickup", "Picked up by driver", "Stopped for inspection", "Back on route", "Successfully delivered"],
    "54321": ["Load booked, waiting for carrier confirmation", "Carrier confirmed", "At warehouse", "Dispatched from warehouse", "Delivered to final destination"]
};

// Get shipment progress for a load
app.get("/api/shipment/:loadId", (req, res) => {
    const { loadId } = req.params;

    if (shipmentProgress[loadId]) {
        res.json({ progress: shipmentProgress[loadId] });
    } else {
        res.status(404).json({ message: "No shipment progress available for this load." });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "chat.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
