document.addEventListener("DOMContentLoaded", function () {
    
    const pinInput = document.getElementById("pin-input");
    const submitPinBtn = document.getElementById("submit-pin");
    const errorMsg = document.getElementById("error-msg");
    const loginContainer = document.getElementById("login-container");
    const chatContainer = document.getElementById("chat-container");
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const suggestionsContainer = document.createElement("div"); // Suggestions dropdown
    suggestionsContainer.classList.add("suggestions");
    userInput.parentNode.appendChild(suggestionsContainer);

    const correctPin = "1234";
    const maxAttempts = 3;
    const lockoutDuration = 1 * 60 * 1000;

    let selectedLoadId = null;
    let selectedCategory = null;

    const availableLoads = {
        "12345": { status: "In Transit", location: "Chicago, IL", driver: "John Doe", estimatedArrival: "3 PM", paymentDue: "$1,200", invoiceStatus: "Pending", carrier: "XYZ Logistics" },
        "67890": { status: "Delivered", location: "Houston, TX", driver: "Jane Smith", estimatedArrival: "Completed", paymentDue: "$800", invoiceStatus: "Paid", carrier: "ABC Freight" },
        "54321": { status: "Delayed", location: "Denver, CO", driver: "Mike Johnson", estimatedArrival: "Tomorrow 10 AM", paymentDue: "$1,500", invoiceStatus: "Under Review", carrier: "LMN Transport" },
    };

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
        },
        "Invoices & Billing": {
            questions: [
                "What is the total outstanding balance?",
                "How do I update my billing details?",
                "Can I get a copy of a past invoice?",
                "What is the late fee policy?"
            ],
            responses: {
                "What is the total outstanding balance?": "Your outstanding balance is **$3,450**.",
                "How do I update my billing details?": "You can update billing details via **your account settings or by contacting support**.",
                "Can I get a copy of a past invoice?": "Yes, invoices can be **downloaded from your billing dashboard**.",
                "What is the late fee policy?": "Late payments **incur a 5% penalty after 7 days**."
            }
        },
        "Driver & Equipment": {
            questions: [
                "What is the truck model assigned to my load?",
                "Is my driver carrying a valid CDL?",
                "What are the truck maintenance records?",
                "Can I change the assigned driver?"
            ],
            responses: {
                "What is the truck model assigned to my load?": "Your load is assigned to a **Freightliner Cascadia 2022**.",
                "Is my driver carrying a valid CDL?": "Yes, the assigned driver has a **valid CDL and all required documents**.",
                "What are the truck maintenance records?": "The truck was **last serviced on February 10, 2025**.",
                "Can I change the assigned driver?": "Driver reassignment is **subject to availability and additional costs**."
            }
        },
        "Compliance & Documentation": {
            questions: [
                "Do I need any special permits for this load?",
                "Has my load passed the weight compliance check?",
                "Is my cargo insured?",
                "What are the ELD compliance regulations?"
            ],
            responses: {
                "Do I need any special permits for this load?": "No special permits are required for this **standard freight**.",
                "Has my load passed the weight compliance check?": "Yes, your load has **cleared weight compliance regulations**.",
                "Is my cargo insured?": "Yes, your cargo is insured under **policy #X98765**.",
                "What are the ELD compliance regulations?": "Drivers must **log their hours electronically as per FMCSA rules**."
            }
        },
        "Support & Issues": {
            questions: [
                "How do I reset my login credentials?",
                "Who do I contact for urgent load issues?",
                "Can I request a callback from customer support?",
                "How do I report a lost or stolen shipment?"
            ],
            responses: {
                "How do I reset my login credentials?": "You can reset credentials via **the 'Forgot Password' option on the login page**.",
                "Who do I contact for urgent load issues?": "For urgent issues, contact **Operations Manager at +1-555-9999**.",
                "Can I request a callback from customer support?": "Yes, **submit a callback request via the support portal**.",
                "How do I report a lost or stolen shipment?": "Report lost shipments immediately to **security@rigbot.com**."
            }
        }
    };

    const responses = {
        "Load Management": ["Track Load Status", "Current Load Location", "Pickup & Drop Confirmation", "Estimated Arrival Time"],
        "Payments & Settlements": ["Pending Payments", "Payment History", "Detention Pay & Reimbursement", "Fuel Surcharge & Additional Fees"],
        "Invoices & Billing": ["View Invoices", "Invoice Payment Status", "Dispute an Invoice"],
        "Driver & Equipment": ["Assigned Drivers", "Truck & Trailer Details", "Driver Availability"],
        "Compliance & Documentation": ["DOT Compliance", "Insurance & Permits", "Safety Inspections"],
        "Support & Issues": ["Contact Dispatcher", "Report Load Issues", "Account & Portal Access"]
    };

    const generalResponses = {
        "hello": "Hello! How can I assist you?",
        "hi": "Hi there! What do you need help with?",
        "who are you": "I am Rigbot, your virtual assistant.",
        "help": "Sure! You can select a category or type your question.",
        "thank you": "You're welcome!",
        "bye": "Goodbye! Have a great day!"
    };

    function generateResponse(subOption) {
        let load = availableLoads[selectedLoadId];

        const responseDetails = {
            "Track Load Status": `Load #${selectedLoadId} is currently ${load.status}.`,
            "Current Load Location": `Load #${selectedLoadId} is at ${load.location}.`,
            "Pickup & Drop Confirmation": `Driver ${load.driver} confirmed the last pickup.`,
            "Estimated Arrival Time": `Estimated arrival for Load #${selectedLoadId} is ${load.estimatedArrival}.`,

            "Pending Payments": `You have a pending payment of ${load.paymentDue} for Load #${selectedLoadId}.`,
            "Payment History": `Last payment for Load #${selectedLoadId} was made successfully.`,
            "Detention Pay & Reimbursement": `A detention pay claim of $200 is under review for Load #${selectedLoadId}.`,
            "Fuel Surcharge & Additional Fees": `Fuel surcharge for Load #${selectedLoadId} is 5% of total freight charge.`,

            "View Invoices": `Invoice for Load #${selectedLoadId} is ${load.invoiceStatus}.`,
            "Invoice Payment Status": `Payment for Load #${selectedLoadId} is ${load.invoiceStatus}.`,
            "Dispute an Invoice": `Your dispute for Load #${selectedLoadId} invoice is under review.`,

            "Assigned Drivers": `Driver ${load.driver} is assigned to Load #${selectedLoadId}.`,
            "Truck & Trailer Details": `Load #${selectedLoadId} is being transported by ${load.carrier}.`,
            "Driver Availability": `Driver ${load.driver} is ${load.status === "Delivered" ? "available" : "currently assigned to another load"}.`,

            "DOT Compliance": `Load #${selectedLoadId} complies with DOT regulations.`,
            "Insurance & Permits": `Carrier ${load.carrier} has valid insurance until Dec 31, 2025.`,
            "Safety Inspections": `Next safety inspection for Load #${selectedLoadId} is scheduled for April 15th.`,

            "Contact Dispatcher": `Dispatcher Alex Johnson is available at +1-555-6789 for Load #${selectedLoadId}.`,
            "Report Load Issues": `Please describe the issue with Load #${selectedLoadId}. Our team will investigate.`,
            "Account & Portal Access": `For account issues related to Load #${selectedLoadId}, contact support@rigbot.com.`
        };

        return responseDetails[subOption] || "No information available.";
    }

    function showShipmentProgress() {
        chatBox.innerHTML = "";
        appendMessage("bot", `Shipment progress for Load #${selectedLoadId}:`);

        let progressSteps = {
            "12345":[
            "Load assigned to carrier",
            "Pickup confirmed",
            "In transit",
            "Approaching destination",
            "Delivered successfully"
        ],
            "67890":[
                "Carrier assigned, waiting for pickup",
                "Picked up by driver",
                "Stopped for inspection",
                "Back on route",
                "Successfully delivered"
            ],
            "54321": [
                "Load booked, waiting for carrier confirmation",
                "Carrier confirmed",
                "At warehouse",
                "Dispatched from warehouse",
                "Delivered to final destination"
            ] };
        let steps = progressSteps[selectedLoadId] || ["No shipment details available."];

        let progressContainer = document.createElement("div");
        progressContainer.classList.add("progress-container");

         steps.forEach((step, index) => {
            let stepElement = document.createElement("div");
            stepElement.classList.add("progress-step");
            stepElement.textContent = `Step ${index + 1}: ${step}`;
            setTimeout(() => {
                stepElement.classList.add("completed");
            }, index * 1000);
            progressContainer.appendChild(stepElement);
        });

        chatBox.appendChild(progressContainer);

        let backBtn = document.createElement("button");
        backBtn.classList.add("sub-option-btn");
        backBtn.textContent = "Back to Categories";
        backBtn.addEventListener("click", function () {
            showMainCategories();
        });
        chatBox.appendChild(backBtn);
    }

    // Function to export shipment details as PDF
    function exportShipmentDetailsPDF() {
        let loadDetails = availableLoads[selectedLoadId];

        let pdfContent = `
            Load ID: ${selectedLoadId}
            Status: ${loadDetails.status}
            Current Location: ${loadDetails.location}
            Driver: ${loadDetails.driver}
            Estimated Arrival: ${loadDetails.estimatedArrival}
            Payment Due: ${loadDetails.paymentDue}
            Invoice Status: ${loadDetails.invoiceStatus}
            Carrier: ${loadDetails.carrier}
        `;

        let pdfWindow = window.open("", "_blank");
        pdfWindow.document.write("<pre>" + pdfContent + "</pre>");
        pdfWindow.document.write("<script>window.print();</script>");
    }

    submitPinBtn.addEventListener("click", function () {
        let enteredPIN = pinInput.value;
        let failedAttempts = parseInt(localStorage.getItem("failedAttempts")) || 0;
        let lockoutTime = localStorage.getItem("lockoutTime");

        if (lockoutTime) {
            let currentTime = new Date().getTime();
            if (currentTime - lockoutTime < lockoutDuration) {
                let remainingTime = Math.ceil((lockoutDuration - (currentTime - lockoutTime)) / 1000);
                errorMsg.textContent = `Too many failed attempts! Try again in ${remainingTime} seconds.`;
                return;
            } else {
                // Reset lockout after time passes
                localStorage.removeItem("lockoutTime");
                localStorage.setItem("failedAttempts", 0);
                failedAttempts = 0;
            }
        }
    
        if (enteredPIN === correctPin) {
            // Correct PIN - Grant Access
            localStorage.setItem("failedAttempts", 0); // Reset failed attempts
            loginContainer.style.display = "none";
            chatContainer.style.display = "block";
            requestLoadId();
        } else {
            // Incorrect PIN - Increment failed attempts
            failedAttempts++;
            localStorage.setItem("failedAttempts", failedAttempts);
    
            if (failedAttempts >= maxAttempts) {
                let lockoutStart = new Date().getTime();
                localStorage.setItem("lockoutTime", lockoutStart);
                errorMsg.textContent = "Too many failed attempts! You are locked out for a minute.";
            } else {
                errorMsg.textContent = `Incorrect PIN. ${maxAttempts - failedAttempts} attempts left.`;
            }
        }
    });
        

    function appendMessage(sender, text) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function requestLoadId() {
        chatBox.innerHTML = "";
        appendMessage("bot","Welcome to Rigbot Q/A portal!");
        appendMessage("bot", "Enter your Load ID or select from available loads:");

        Object.keys(availableLoads).forEach(loadId => {
            let loadBtn = document.createElement("button");
            loadBtn.classList.add("sub-option-btn");
            loadBtn.textContent = `Load #${loadId}`;
            loadBtn.addEventListener("click", function () {
                selectedLoadId = loadId;
                appendMessage("user", `Selected Load ID: ${loadId}`);
                showMainCategories();
            });
            chatBox.appendChild(loadBtn);
        });
    }

    function showMainCategories() {
        chatBox.innerHTML = "";
        appendMessage("bot", `Load #${selectedLoadId} selected. Choose a category:`);

        Object.keys(responses).forEach(category => {
            let categoryBtn = document.createElement("button");
            categoryBtn.classList.add("menu-btn");
            categoryBtn.textContent = category;
            categoryBtn.addEventListener("click", function () {
                appendMessage("user", category);
                showSubOptions(category);
            });
            chatBox.appendChild(categoryBtn);
        });

        let shipmentProgressBtn = document.createElement("button");
        shipmentProgressBtn.classList.add("sub-option-btn");
        shipmentProgressBtn.textContent = "View Shipment Progress";
        shipmentProgressBtn.addEventListener("click", function () {
            showShipmentProgress();
        });
        chatBox.appendChild(shipmentProgressBtn);

        // PDF Export Button
        let exportPDFBtn = document.createElement("button");
        exportPDFBtn.classList.add("sub-option-btn");
        exportPDFBtn.textContent = "Export Shipment Details (PDF)";
        exportPDFBtn.addEventListener("click", function () {
            exportShipmentDetailsPDF();
        });
        chatBox.appendChild(exportPDFBtn);

        let startOverBtn = document.createElement("button");
        startOverBtn.classList.add("sub-option-btn");
        startOverBtn.textContent = "Start Over";
        startOverBtn.addEventListener("click", function () {
            chatBox.innerHTML = "";
            selectedLoadId = null;
            requestLoadId();
        });
        chatBox.appendChild(startOverBtn);
    }

    function showSuggestions() {
        let query = userInput.value.toLowerCase();
        suggestionsContainer.innerHTML = "";

        if (!selectedCategory || !query) {
            return;
        }

        let suggestions = hardcodedData[selectedCategory]?.questions.filter(q =>
            q.toLowerCase().includes(query)
        ) || [];

        suggestions.forEach(suggestion => {
            let suggestionItem = document.createElement("div");
            suggestionItem.classList.add("suggestion-item");
            suggestionItem.textContent = suggestion;
            suggestionItem.addEventListener("click", function () {
                userInput.value = suggestion;
                suggestionsContainer.innerHTML = "";
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
    }

    userInput.addEventListener("input", showSuggestions);

    sendBtn.addEventListener("click", function () {
        let userText = userInput.value.trim();

        if (userText) {
            appendMessage("user", userText);
            let response;
            
            if (selectedCategory && hardcodedData[selectedCategory].responses[userText]) {
                response = hardcodedData[selectedCategory].responses[userText];
            } else {
                response = "Please choose a relevant category to start your query.";
            }

            setTimeout(() => appendMessage("bot", response), 500);
            userInput.value = "";
            suggestionsContainer.innerHTML = "";
        }
    });


    function showSubOptions(category) {
        chatBox.innerHTML = "";
        appendMessage("bot", `You selected ${category}. Choose an option:`);
        selectedCategory = category;

        responses[category].forEach(subOption => {
            let subOptionBtn = document.createElement("button");
            subOptionBtn.classList.add("sub-option-btn");
            subOptionBtn.textContent = subOption;
            subOptionBtn.addEventListener("click", function () {
                appendMessage("user", subOption);
                setTimeout(() => {
                    appendMessage("bot", generateResponse(subOption));
                }, 500);
            });
            chatBox.appendChild(subOptionBtn);
        });

        let backBtn = document.createElement("button");
        backBtn.classList.add("sub-option-btn");
        backBtn.textContent = "Back to Categories";
        backBtn.addEventListener("click", function () {
            showMainCategories();
        });
        chatBox.appendChild(backBtn);
    }

    sendBtn.addEventListener("click", function () {
        let userText = userInput.value.trim().toLowerCase();
        if (userText) {
            appendMessage("user", userInput.value);
            let botResponse = generalResponses[userText] || "I didn't understand that. Please choose a menu option or rephrase.";
            setTimeout(() => appendMessage("bot", botResponse), 500);
            userInput.value = "";
        }
    });

    
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendBtn.click();
        }
    });
});


