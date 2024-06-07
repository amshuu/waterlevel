document.addEventListener('DOMContentLoaded', function () {
    let nodes = JSON.parse(localStorage.getItem('nodes')) || [];
    let editIndex = null;

    const nodesContainer = document.getElementById('nodes-container');

    function saveToLocalStorage() {
        localStorage.setItem('nodes', JSON.stringify(nodes));
    }

    function renderNodes() {
        nodesContainer.innerHTML = '';
        nodes.forEach((node, index) => {
            const nodeBox = document.createElement('div');
            nodeBox.className = `node-box ${node.status.toLowerCase()}`;
            nodeBox.innerHTML = `
                <h2>${node.name}</h2>
                <p><strong>Location:</strong> ${node.location}</p>
                <p><strong>Status:</strong> ${node.status} ${node.status === 'Inactive' ? `(Inactive for ${calculateInactiveDuration(node.lastReading)})` : ''}</p>
                <p><strong>Last Reading:</strong> ${new Date(node.lastReading).toLocaleString()}</p>
                <p><strong>Last Value:</strong> ${node.lastValue}</p>
                <button class="view-details-button" data-index="${index}">View Details</button>
                <button class="edit-button" data-index="${index}">Edit</button>
                <button class="delete-button" data-index="${index}">Delete</button>
            `;
            nodesContainer.appendChild(nodeBox);
        });
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', deleteNode);
        });
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', openEditModal);
        });
        document.querySelectorAll('.view-details-button').forEach(button => {
            button.addEventListener('click', openDetailsModal);
        });
    }

    function calculateInactiveDuration(lastReading) {
        const now = new Date();
        const lastReadingDate = new Date(lastReading);
        const diffInMilliseconds = now - lastReadingDate;
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        if (diffInHours < 24) {
            return `${diffInHours} hours`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            const remainingHours = diffInHours % 24;
            return `${diffInDays} days and ${remainingHours} hours`;
        }
    }

    function deleteNode(event) {
        const nodeIndex = event.target.getAttribute('data-index');
        nodes.splice(nodeIndex, 1);
        saveToLocalStorage();
        renderNodes();
    }

    function openModal() {
        document.getElementById('add-node-modal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('add-node-modal').style.display = 'none';
        document.getElementById('edit-node-modal').style.display = 'none';
        document.getElementById('view-details-modal').style.display = 'none';
    }

    async function fetchLastReading(channelId, apiKey) {
        const apiUrl = `https://api.thingspeak.com/channels/${channelId}/fields/6/last.json?api_key=${apiKey}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.created_at && data.field6) {
                return {
                    lastReading: new Date(data.created_at),
                    lastValue: data.field6
                };
            }
        } catch (error) {
            console.error('Error fetching last reading:', error);
        }
        return null;
    }

    async function saveNode() {
        const name = document.getElementById('node-name').value;
        const location = document.getElementById('node-location').value;
        const channelId = document.getElementById('node-channel-id').value;
        const writeApiKey = document.getElementById('node-api-key').value;
        const readApiKey = document.getElementById('node-read-api-key').value;
        const graphLink = document.getElementById('node-graph-link').value;

        if (!name || !location || !channelId || !writeApiKey || !readApiKey || !graphLink) {
            alert('Please fill in all required fields.');
            return;
        }

        const { lastReading, lastValue } = await fetchLastReading(channelId, readApiKey);
        if (!lastReading) {
            alert('Could not fetch the last reading. Please check the channel ID and API keys.');
            return;
        }

        const now = new Date();
        const status = (now - lastReading) / (1000 * 60 * 60) > 24 ? 'Inactive' : 'Active';

        nodes.push({
            name, location, status, lastReading, lastValue, graphLink,
            channelId, writeApiKey, readApiKey,
            length: '', breadth: '', depth: '', radius: '', volume: '',
            qrDetails: '', wifiName: '', password: '', mode: ''
        });
        saveToLocalStorage();
        closeModal();
        renderNodes();
    }

    function openEditModal(event) {
        editIndex = event.target.getAttribute('data-index');
        const node = nodes[editIndex];

        document.getElementById('edit-node-name').value = node.name;
        document.getElementById('edit-node-location').value = node.location;
        document.getElementById('edit-node-channel-id').value = node.channelId;
        document.getElementById('edit-node-api-key').value = node.writeApiKey;
        document.getElementById('edit-node-read-api-key').value = node.readApiKey;
        document.getElementById('edit-node-graph-link').value = node.graphLink;

        document.getElementById('edit-node-modal').style.display = 'block';
    }

    async function updateNode() {
        const name = document.getElementById('edit-node-name').value;
        const location = document.getElementById('edit-node-location').value;
        const channelId = document.getElementById('edit-node-channel-id').value;
        const writeApiKey = document.getElementById('edit-node-api-key').value;
        const readApiKey = document.getElementById('edit-node-read-api-key').value;
        const graphLink = document.getElementById('edit-node-graph-link').value;

        if (!name || !location || !channelId || !writeApiKey || !readApiKey || !graphLink) {
            alert('Please fill in all required fields.');
            return;
        }

        const { lastReading, lastValue } = await fetchLastReading(channelId, readApiKey);
        if (!lastReading) {
            alert('Could not fetch the last reading. Please check the channel ID and API keys.');
            return;
        }

        const now = new Date();
        const status = (now - lastReading) / (1000 * 60 * 60) > 24 ? 'Inactive' : 'Active';

        nodes[editIndex] = {
            name, location, status, lastReading, lastValue, graphLink,
            channelId, writeApiKey, readApiKey,
            length: '', breadth: '', depth: '', radius: '', volume: '',
            qrDetails: '', wifiName: '', password: '', mode: ''
        };
        saveToLocalStorage();
        closeModal();
        renderNodes();
    }

    function openDetailsModal(event) {
        const nodeIndex = event.target.getAttribute('data-index');
        const node = nodes[nodeIndex];

        document.getElementById('details-name').innerText = node.name;
        document.getElementById('details-location').innerText = node.location;
        document.getElementById('details-status').innerText = node.status;
        document.getElementById('details-last-reading').innerText = new Date(node.lastReading).toLocaleString();
        document.getElementById('details-last-value').innerText = node.lastValue;
        document.getElementById('details-channel-id').innerText = node.channelId;
        document.getElementById('details-write-api-key').innerText = node.writeApiKey;
        document.getElementById('details-read-api-key').innerText = node.readApiKey;
        document.getElementById('details-graph-link').href = node.graphLink;

        // Optional fields
        document.getElementById('details-length').innerText = node.length || 'N/A';
        document.getElementById('details-breadth').innerText = node.breadth || 'N/A';
        document.getElementById('details-depth').innerText = node.depth || 'N/A';
        document.getElementById('details-radius').innerText = node.radius || 'N/A';
        document.getElementById('details-volume').innerText = node.volume || 'N/A';
        document.getElementById('details-qr-details').innerText = node.qrDetails || 'N/A';
        document.getElementById('details-wifi-name').innerText = node.wifiName || 'N/A';
        document.getElementById('details-password').innerText = node.password || 'N/A';
        document.getElementById('details-mode').innerText = node.mode || 'N/A';

        document.getElementById('details-graph-frame').src = node.graphLink;

        document.getElementById('view-details-modal').style.display = 'block';
    }

    document.getElementById('add-node-button').addEventListener('click', openModal);
    document.querySelectorAll('.close').forEach(button => button.addEventListener('click', closeModal));
    document.getElementById('save-node-button').addEventListener('click', saveNode);
    document.getElementById('update-node-button').addEventListener('click', updateNode);

    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('add-node-modal') || event.target === document.getElementById('edit-node-modal') || event.target === document.getElementById('view-details-modal')) {
            closeModal();
        }
    });

    renderNodes();
});
