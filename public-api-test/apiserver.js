const axios = require('axios'); 
const express = require('express');
const path = require('path');


const app = express();
const PORT = 3000;

app.use(express.static(__dirname));


app.get('/api/product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Making the API call with axios
        const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
        
        // Sending the response data to the client
        res.json(response.data);
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "api.html"));
});


app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});
