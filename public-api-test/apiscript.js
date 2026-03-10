document.addEventListener("DOMContentLoaded", () => {
    const pinInput = document.getElementById("pin-input");
    const submitPinBtn = document.getElementById("submit-pin");
    const errorMsg = document.getElementById("error-msg");
    const loginContainer = document.getElementById("login-container");
    const chatContainer = document.getElementById("chat-container");
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    
    const correctPin = "1234";
    const maxAttempts = 3;
    const lockoutDuration = 1 * 60 * 1000;

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
        const message = document.createElement("p");
        message.classList.add(sender === "bot" ? "bot-message" : "user-message");
        message.textContent = text;
        chatBox.appendChild(message);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Event listener for sending the user input
    sendBtn.addEventListener("click", () => {
        const userText = userInput.value.trim();
        if (!userText) return;

        appendMessage("user", userText);
        userInput.value = "";

        if (userText.toLowerCase().startsWith("get product")) {
            const parts = userText.split(" ");
            const productId = parts[2];

            appendMessage("bot", "Fetching product details...");

            fetch(`https://fakestoreapi.com/products/${productId}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Product not found");
                    }
                    return res.json();
                })
                .then(data => {
                    const title = data.title;
                    const price = data.price;
                    appendMessage("bot", ` Product: ${title}\n Price: $${price}`);
                })
                .catch(err => {
                    console.error("API Error:", err);
                    appendMessage("bot", "Sorry, couldn't fetch product details. Try another ID.");
                });
        } else {
            appendMessage("bot", "Try typing: get product 3");
        }
    });

    async function fetchProduct(productId) {
        try {
            const response = await fetch(`/api/product/${productId}`);
            const data = await response.json();
            if (response.ok) {
                // Display the product data (title, price, etc.)
                console.log("Product fetched:", data);
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error("Error fetching product:", err);
        }
    }
    
    fetchProduct(3);


    // Event listener for clearing the chat
    clearChatBtn.addEventListener("click", () => {
        chatBox.innerHTML = "";
    });
});
