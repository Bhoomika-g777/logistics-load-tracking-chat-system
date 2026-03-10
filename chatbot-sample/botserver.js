const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

app.use(express.static(__dirname));

const responses = {
    "Discuss": "Join discussions with experts in our forum.",
    "FAQ": "Check out our FAQ section for common questions.",
    "Medical advice": "Proceed further!",
    "Abbreviations": "Proceed further!",
    "Finding a hospital": "Proceed further!",
    "Fever": "Stay hydrated and monitor your temperature. Consult a doctor if needed.",
    "Cough": "Try warm fluids and cough drops. If it persists, consult a doctor.",
    "Headache": "Drink water or have a small caffeinated drink.",
    "AAHP": "American Association of Health Plans",
    "AAPCC": "Average Adjusted Per Capita Cost",
    "BP": "Blood Pressure",
    "BSN": "Bachelor of Science in Nursing",
    "COPD": "Chronic Obstructive Pulmonary Disease",
    "CNS": "Central Nervous System",
    "DC": "Doctor of Chiropractic",
    "DOA": "Dead on Arrival",
    "hospital near me": "Provide your location for nearby hospitals.",
    "hospitals with [specialty]": "Provide your location and specialty preference.",

    // Technology responses
    "Latest Gadgets": "Proceed further!",
    "Tech News": "Proceed further!",
    "Coding help": "Proceed further!",
    "Smartphones": "Check out OnePlus 12, Xiaomi 14, and Vivo X100 Pro.",
    "Wearables": "Latest wearables: Apple Watch Series 9, Samsung Galaxy Watch 6, Fitbit Sense 2.",
    "Laptops": "Top laptops: ASUS Zenbook Pro 16X OLED, Lenovo Yoga 9i, Razer Blade 18.",
    "Latest": "Quantum computing advancements, AI-powered tools, and data privacy issues.",
    "AI Updates": "Progress in NLP for human-like AI interactions.",
    "Cybersecurity": "Cyberattack threats and how to stay secure.",
    "Python": "Need help with NumPy or Pandas? I can guide you.",
    "Javascript": "Issues with DOM manipulation or async programming?",
    "Java": "Need help with Java libraries like Apache Commons or Google Guava?",

    // Entertainment responses
    "Tell me joke": "Parallel lines have so much in common. It's a shame they'll never meet.",
    "Recommend Book": "Try 'The Name of the Wind' by Patrick Rothfuss.",
    "Trending movies": "'Napoleon', 'The Killer', and 'Poor Things' are trending now."

    
};
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "bot.html"));
});

app.get("/bot-response", (req, res) => {
    const choice = req.query.choice;
    res.send(responses[choice] || "I'm not sure about that.");
});

const PORT = 3000; 
app.listen(PORT, () => console.log(`Chatbot running on http://localhost:${PORT}`));
