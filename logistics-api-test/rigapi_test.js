document.getElementById('send-btn').addEventListener('click', async () => {
    const input = document.getElementById('user-input').value.trim();
    const chatBox = document.getElementById('chat-box');

    if (!input) return;

    // Show user message
    const userMsg = document.createElement('p');
    userMsg.className = 'user-message';
    userMsg.innerText = input;
    chatBox.appendChild(userMsg);

    const addBotMessage = (html) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'bot-message';
        wrapper.innerHTML = html;
        chatBox.appendChild(wrapper);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const fetchAndRender = async (type, endpoint) => {
        try {
            const res = await fetch(`http://localhost:3000/api/${endpoint}`);
            const data = await res.json();

            console.log(`${type.toUpperCase()} API response:`, data);

            let itemsArray = [];

            if (data.success) {
                if (Array.isArray(data.data)) {
                    itemsArray = data.data;
                } else if (type === 'truck' && Array.isArray(data.data.vehicles)) {
                    itemsArray = data.data.vehicles;
                } else if (type === 'trailer' && Array.isArray(data.data.trailers)) {
                    itemsArray = data.data.trailers;
                }
            }

            if (itemsArray.length > 0) {
                const cards = itemsArray.map((item) => {
                    if (type === 'driver') {
                        return `
                            <div class="card">
                                <strong>${item.name_first || 'N/A'} ${item.name_last || ''}</strong><br/>
                                License #: ${item.dl_number || 'N/A'}<br/>
                                Issued: ${item.dl_date_issued || 'N/A'}<br/>
                                Expires: ${item.dl_date_expires || 'N/A'}<br/>
                                Active: ${item.active ? 'Yes' : 'No'}
                            </div>`;
                    } else if (type === 'truck') {
                        return `
                            <div class="card">
                                <strong>Truck ID: ${item.truckId || item.truckID || 'N/A'}</strong><br/>
                                Plate: ${item.licensePlate || item.plate || 'N/A'}<br/>
                                Type: ${item.vehicleType || item.type || 'N/A'}
                            </div>`;
                    } else if (type === 'trailer') {
                        return `
                            <div class="card">
                                <strong>Trailer ID: ${item.trailerId || item.trailerID || 'N/A'}</strong><br/>
                                Plate: ${item.licensePlate || item.plate || 'N/A'}<br/>
                                Type: ${item.trailerType || item.type || 'N/A'}
                            </div>`;
                    }
                }).join('');

                addBotMessage(`<p>Here are the ${type}s:</p>${cards}`);
            } else {
                addBotMessage(`<p>No ${type} data found.</p>`);
            }
        } catch (err) {
            console.error(`Error fetching ${type} data:`, err);
            addBotMessage(`<p>Error fetching ${type} data. Please try again later.</p>`);
        }
    };

    const lcInput = input.toLowerCase();

    if (lcInput.includes('driver')) {
        await fetchAndRender('driver', 'drivers');
    } else if (lcInput.includes('truck')) {
        await fetchAndRender('truck', 'trucks');
    } else if (lcInput.includes('trailer')) {
        await fetchAndRender('trailer', 'trailers');
    } else {
        addBotMessage(`<p>I didn't understand that. You can ask about <strong>drivers</strong>, <strong>trucks</strong>, or <strong>trailers</strong>.</p>`);
    }

    document.getElementById('user-input').value = '';
});
rigapi_test.js