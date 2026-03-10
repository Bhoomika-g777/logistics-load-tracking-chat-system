document.addEventListener("DOMContentLoaded", function () {
    const messageSection = document.getElementById("message-section");
    const inputField = document.getElementById("input");

    function appendMessage(text, sender) {
        const message = document.createElement("div");
        message.classList.add("message", sender);
        message.innerText = text;
        if (sender === "user") {
            message.style.textAlign = "right";  // Align text to right
            message.style.backgroundColor = "#343a40";  // Dark background for user input
            message.style.color = "white";  // White text
            message.style.borderRadius = "1.5vw 1.5vw 0 1.5vw";  // Round only some corners
            message.style.float = "right";  // Float user message to the right
            message.style.clear = "both";  // Ensure proper alignment
            message.style.padding = "10px 25px"; // Padding for better appearance
            message.style.fontSize = "20px";  // Match button text size
            message.style.maxWidth = "fit-content";  // Wrap text properly
            message.style.wordWrap = "break-word";
        }else if (sender === "bot") {
            message.id = "bot";
        }   
        messageSection.appendChild(message);
        messageSection.scrollTop = messageSection.scrollHeight;
    }

    function appendMenuOptions(options) {
        const menuDiv = document.createElement("div");
        menuDiv.classList.add("menu-options");
        
        options.forEach(option => {
            const button = document.createElement("button");
            button.innerText = option;
            button.classList.add("menu-button");
            button.onclick = () => handleMenuSelection(option);
            menuDiv.appendChild(button);
        });
        
        messageSection.appendChild(menuDiv);
        messageSection.scrollTop = messageSection.scrollHeight;
    }

    function handleMenuSelection(option) {
        appendMessage(option, "user");
        setTimeout(() => {
            if (option === "Yes") {
                appendMessage("Great! What would you like to discuss about", "bot");
                appendMenuOptions(["Healthcare", "Technology", "Entertainment", "Discuss", "FAQ"]);
                return;
            }
    
            if (option === "No") {
                appendMessage("Alright! Let me know if you need anything else.", "bot");
                return;
            }
    
            if (option === "Healthcare") {
                appendMessage("Thats Great! Choose any", "bot");
                appendMenuOptions(["Medical advice", "Abbreviations", "Finding a hospital", "Start Over"]);
                return;
            }
    
            if (option === "Technology") {
                appendMessage("Seems you are tech enthusiast!.Choose any", "bot");
                appendMenuOptions(["Latest Gadgets", "Coding help", "Tech News", "Start Over"]);
                return;
            }

            if (option === 'Entertainment') {
                appendMessage("How would you like to get entertained!.Choose any","bot");
                appendMenuOptions(["Tell me joke","Trending movies","Recommend Book"]);
                return;
            }

            if (option === "Medical advice") {
                appendMessage("Proceed further!","bot");
                appendMenuOptions(["Fever","Headache","Cough"]);
                return;
            }

            if (option === "Abbreviations") {
                appendMessage("Proceed further!","bot");
                appendMenuOptions(["AAHP","AAPCC","BP","BSN","COPD","CNS","DC","DOA"]
                   );
                return;
            }

            if (option === "Finding a hospital") {
                appendMessage("Proceed further!","bot");
                appendMenuOptions(["hospital near me","hospitals with [specialty]"]);
                return;
            }

            if (option === "Latest Gadjets") {
                appendMessage("Proceed further!","bot");
                appendMenuOptions(["Smartphones","Wearables","Laptops"]);
                return; 
            }

            if (option === "Tech News") {
                appendMessage("Proceed further!","bot");
                appendMenuOptions(["Latest","AI updates","Cybersecurity"]);
                return;
            }

            if (option === "Coding help") {
                appendMessage("Proceed further!","bot");
                appendMenuOptions(["python","Javascript","Java"]);
                return;
            }

            if (option === "Start Over"){
                startChat();
                return;
            }

            let response = "";
            switch (option) {
                case "Fever":
                    response = "I understand you have a fever. It's important to stay hydrated and monitor your temperature. Please consult a doctor if it doesn't improve or if you have other concerns.";
                    break;
                case "Cough":
                    response = "A cough can be due to several reasons. Try drinking warm fluids and consider using cough drops. If it persists, consult a doctor.";
                    break;
                case "Headache":
                    response = "Drink a large glass of water or have a small caffeinated drink.";
                    break;
                case "AAHP":
                    response = "American Association of Health Plans";
                    break;
                case "AAPCC":
                    response = "Average Adjusted Per Capita Cost";
                    break;
                case "BP":
                    response = "Blood Pressure";
                    break;
                case "BSN":
                    response = "Bachelor of Science in Nursing";
                    break;
                case "COPD":
                    response = "Chronic Obstructive Pulmonary Disease";
                    break;  
                case "CNS":
                    response = "Central Nervous System";
                     break;  
                case "DC":
                    response = "Doctor of Chiropractic";
                    break; 
                case "DOA":
                    response = "Dead on Arrival";
                    break; 
                case "hospital near me":
                    response = "To help you find a hospital, please provide your current location or the area you're interested in.";
                    break;  
                case "hospitals with [specialty]":
                    response = "To find a specialist, I need to know your location and any preferences you may have (e.g., hospital, insurance).";
                    break;
                case "Smartphones":
                    response = "Looking for a new phone? Check out the OnePlus 12, Xiaomi 14, and Vivo X100 Pro. They boast impressive features at competitive prices.";
                    break; 
                case "Wearables":
                    response = "The latest wearables include the Apple Watch Series 9, Samsung Galaxy Watch 6, and Fitbit Sense 2. They offer advanced health tracking, fitness features, and smartwatch functionality.";
                    break; 
                case "Laptops":
                    response = "Need a new laptop? The ASUS Zenbook Pro 16X OLED, Lenovo Yoga 9i, and Razer Blade 18 offer top-notch performance and portability.";
                    break;  
                case "Latest":
                    response = "Some of the latest tech news include advancements in quantum computing, the development of new AI-powered tools, and the increasing concerns about data privacy.";
                    break; 
                case "AI Updates":
                    response = "In AI news, researchers have made significant progress in natural language processing, enabling more human-like interactions with AI systems.";
                    break;  
                case "Cybersecurity":
                    response = "The latest cybersecurity news warns about the increasing sophistication of cyberattacks and the need for individuals and organizations to stay vigilant.";
                    break;  
                case "Python":
                    response = "Need help with Python libraries like NumPy or Pandas? I can guide you through their functionalities.";
                    break;  
                case "Javascript":
                    response = "JavaScript is essential for web development. Are you facing issues with DOM manipulation or asynchronous programming?";
                    break;
                case "Java":
                    response = "Need help with Java libraries like Apache Commons or Google Guava? I can provide explanations and examples.";
                    break; 
                case "Tell me joke":
                    response = "Parallel lines have so much in common. It's a shame they'll never meet.";
                    break;
                case "Recommend Book":
                    response = "If you enjoy fantasy, try 'The Name of the Wind' by Patrick Rothfuss. It's a beautifully written coming-of-age story with magic and adventure.";
                    break; 
                case "Trending movies":
                    response = "If you're looking for something different, check out 'Napoleon', 'The Killer', and 'Poor Things'.";
                    break; 
                case "Discuss":
                    response = "Join the community and discuss various topics.";
                    break;                  
                case "FAQ":
                    response = "Find answers to frequently asked questions here.";
                    break;
                case "Yes":
                    response = "Great! Here are some options for you.";
                    appendMenuOptions(["Internship", "IQ", "Quark", "Cosmos", "Discuss", "FAQ"]);
                    return;
                case "No":
                    response = "Alright! Let me know if you need anything else.";
                    return;
                default:
                    response = "";
            }
            appendMessage(response, "bot");
            appendMenuOptions(["Healthcare", "Technology", "Entertainment","Discuss", "FAQ"]);
        }, 5500);
    }

    function startChat() {
        appendMessage("Hey! Welcome to Chatter Box!", "bot");
        setTimeout(() => {
            appendMessage("Can I assist you?", "bot");
            appendMenuOptions(["Yes","No"]);
        }, 5500);
    }

    startChat();
});
