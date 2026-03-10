document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const responseOptions = document.getElementById("response-options");
    const carrierDetails = document.getElementById("carrier-details");
    const showLoadsBtn = document.getElementById("show-loads-btn");
    const loadList = document.getElementById("load-list");
    const pinInput = document.getElementById("pin-input");
    const submitPinBtn = document.getElementById("submit-pin");
    const errorMsg = document.getElementById("error-msg");
    const loginContainer = document.getElementById("login-container");
    const chatContainer = document.getElementById("chat-container");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const clearChatBtn = document.getElementById("clear-chat-btn");

    const correctPin = "1234"; 
    let selectedLoad = null;

    const loads = {
        "LOAD-1001": { status: "In Transit", driver: "John Doe", location: "Chicago, IL", eta: "5 PM", payment: "$1,200", invoice: "Pending", notes: "Delayed due to bad weather" },
        "LOAD-1002": { status: "Delivered", driver: "Jane Smith", location: "Houston, TX", eta: "Completed", payment: "$800", invoice: "Paid", notes: "Successfully delivered" },
        "LOAD-1006": { status: "Delayed", driver: "Emma Brown", location: "New York, NY", eta: "Tomorrow 12 PM", payment: "$1,800", invoice: "Under Review", notes: "Driver on rest break" }
    };

    const predefinedQuestions = [
        "What is the status of LOAD-",
        "Who is the driver of LOAD-",
        "Where is LOAD-",
        "What is the ETA of LOAD-",
        "Has payment been made for LOAD-",
        "Is the invoice ready for LOAD-"
    ];

    // Function to append messages in chat
    function appendMessage(sender, text) {
        const message = document.createElement("p");
        message.classList.add(sender === "bot" ? "bot-message" : "user-message");
        message.textContent = text;
        chatBox.appendChild(message);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // PIN Authentication
    submitPinBtn.addEventListener("click", function () {
        if (pinInput.value === correctPin) {
            loginContainer.style.display = "none";     // Hide login section
            chatContainer.style.display = "block";     // Show chat section
            userInput.focus();                         // Autofocus on input field
            errorMsg.textContent = "";                 // Clear any old error message
        } else {
            errorMsg.textContent = "Incorrect PIN!";   // Show error message
        }
    });

    // Show Load List when user clicks "View Active Loads"
    showLoadsBtn.addEventListener("click", () => {
        appendMessage("user", "View Active Loads");
        appendMessage("bot", "Here are the available loads. Click on a load to view details:");
        displayLoadList();
    });

    // Function to display the load list
    function displayLoadList(filter = "") {
        chatBox.innerHTML = ""; // Clear chat before displaying loads
        Object.keys(loads).forEach(loadId => {
            if (loadId.includes(filter.toUpperCase())) {
                const loadBtn = document.createElement("button");
                loadBtn.textContent = loadId;
                loadBtn.classList.add("load-btn");
                loadBtn.addEventListener("click", () => handleLoadSelection(loadId));
                chatBox.appendChild(loadBtn);
            }
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Handle Load Selection
    function handleLoadSelection(loadId) {
        appendMessage("user", loadId);
        selectedLoad = loads[loadId];

        appendMessage("bot", `You selected ${loadId}. What details do you need?`);

        const detailsMenu = [
            { label: "Status", value: selectedLoad.status },
            { label: "Driver", value: selectedLoad.driver },
            { label: "Location", value: selectedLoad.location },
            { label: "ETA", value: selectedLoad.eta },
            { label: "Payment", value: selectedLoad.payment },
            { label: "Invoice", value: selectedLoad.invoice },
            { label: "Additional Info", value: selectedLoad.notes }
        ];

        detailsMenu.forEach(detail => {
            const detailBtn = document.createElement("button");
            detailBtn.textContent = detail.label;
            detailBtn.classList.add("detail-btn");
            detailBtn.addEventListener("click", () => {
                appendMessage("user", detail.label);
                appendMessage("bot", `${detail.label}: ${detail.value}`);
            });
            chatBox.appendChild(detailBtn);
        });

        // Add Back button
        const backBtn = document.createElement("button");
        backBtn.textContent = "Back to Loads";
        backBtn.classList.add("back-btn");
        backBtn.addEventListener("click", () => showLoadsBtn.click());
        chatBox.appendChild(backBtn);
    }

    // Process User Input
    sendBtn.addEventListener("click", () => processUserInput(userInput.value.trim()));
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") processUserInput(userInput.value.trim());
    });

    function processUserInput(input) {
        if (!input) return;
        appendMessage("user", input);

        if (loads[input]) {
            handleLoadSelection(input);
        } else {
            checkPredefinedQuestion(input);
        }

        userInput.value = "";
    }

    function checkPredefinedQuestion(input) {
        const regex = /LOAD-(\d+)/;
        const match = input.match(regex);
        if (match) {
            const loadId = `LOAD-${match[1]}`;
            if (loads[loadId]) {
                const words = input.toLowerCase();
                let response = "I didn't understand your question.";

                if (words.includes("status")) response = `Status of ${loadId}: ${loads[loadId].status}`;
                else if (words.includes("driver")) response = `Driver of ${loadId}: ${loads[loadId].driver}`;
                else if (words.includes("location")) response = `Location of ${loadId}: ${loads[loadId].location}`;
                else if (words.includes("eta")) response = `ETA of ${loadId}: ${loads[loadId].eta}`;
                else if (words.includes("payment")) response = `Payment status for ${loadId}: ${loads[loadId].payment}`;
                else if (words.includes("invoice")) response = `Invoice status for ${loadId}: ${loads[loadId].invoice}`;
                else if (words.includes("info")) response = `Additional info on ${loadId}: ${loads[loadId].notes}`;

                appendMessage("bot", response);
            } else {
                appendMessage("bot", "I couldn't find details for that load.");
            }
        } else {
            appendMessage("bot", "Please enter a valid load number (e.g., LOAD-1006) or ask a question related to a load.");
        }
    }

    // Clear Chat Button
    clearChatBtn.addEventListener("click", () => {
        chatBox.innerHTML = "";
        appendMessage("bot", "Chat cleared. How can I assist you?");
    });
});


