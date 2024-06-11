let nodes = [];
let currentEditIndex = null;

// Load nodes from localStorage
window.onload = function() {
    if (localStorage.getItem('nodes')) {
        nodes = JSON.parse(localStorage.getItem('nodes'));
    }
    displayNodes();
};

// Function to display nodes
function displayNodes() {
    const nodesContainer = document.getElementById('nodes-container');
    nodesContainer.innerHTML = '';
    nodes.forEach((node, index) => {
        const nodeBox = document.createElement('div');
        nodeBox.className = `node-box ${node.status.toLowerCase()}`;
        nodeBox.innerHTML = `
            <h3>${node.name}</h3>
            <p>Location: ${node.location}</p>
            <p>Status: ${node.status}</p>
            <button class="edit-button" onclick="openEditModal(${index})">Edit</button>
            <button class="delete-button" onclick="deleteNode(${index})">Delete</button>
            <button class="view-button" onclick="openViewDetailsModal(${index})">View Details</button>
        `;
        nodesContainer.appendChild(nodeBox);
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

// Function to open the Add Node modal
document.getElementById('add-node-button').onclick = function() {
    document.getElementById('add-node-modal').style.display = 'block';
};

// Function to close the modal
function closeModal() {
    document.getElementById('add-node-modal').style.display = 'none';
    document.getElementById('edit-node-modal').style.display = 'none';
    document.getElementById('view-details-modal').style.display = 'none';
}

// Function to save a new node
document.getElementById('save-node-button').onclick = function() {
    const node = {
        name: document.getElementById('node-name').value,
        location: document.getElementById('node-location').value,
        channelID: document.getElementById('node-channel-id').value,
        writeAPIKey: document.getElementById('node-api-key').value,
        readAPIKey: document.getElementById('node-read-api-key').value,
        graphLink: document.getElementById('node-graph-link').value,
        length: document.getElementById('node-length').value,
        breadth: document.getElementById('node-breadth').value,
        depth: document.getElementById('node-depth').value,
        radius: document.getElementById('node-radius').value,
        volume: document.getElementById('node-volume').value,
        qrDetails: document.getElementById('node-qr-details').value,
        wifiName: document.getElementById('node-wifi-name').value,
        password: document.getElementById('node-password').value,
        mode: document.getElementById('node-mode').value,
        status: 'Inactive'
    };
    nodes.push(node);
    localStorage.setItem('nodes', JSON.stringify(nodes));
    closeModal();
    displayNodes();
};

// Function to open the Edit Node modal
function openEditModal(index) {
    currentEditIndex = index;
    const node = nodes[index];
    document.getElementById('edit-node-name').value = node.name;
    document.getElementById('edit-node-location').value = node.location;
    document.getElementById('edit-node-channel-id').value = node.channelID;
    document.getElementById('edit-node-api-key').value = node.writeAPIKey;
    document.getElementById('edit-node-read-api-key').value = node.readAPIKey;
    document.getElementById('edit-node-graph-link').value = node.graphLink;
    document.getElementById('edit-node-length').value = node.length;
    document.getElementById('edit-node-breadth').value = node.breadth;
    document.getElementById('edit-node-depth').value = node.depth;
    document.getElementById('edit-node-radius').value = node.radius;
    document.getElementById('edit-node-volume').value = node.volume;
    document.getElementById('edit-node-qr-details').value = node.qrDetails;
    document.getElementById('edit-node-wifi-name').value = node.wifiName;
    document.getElementById('edit-node-password').value = node.password;
    document.getElementById('edit-node-mode').value = node.mode;
    document.getElementById('edit-node-modal').style.display = 'block';
}

// Function to update a node
document.getElementById('update-node-button').onclick = function() {
    const node = nodes[currentEditIndex];
    node.name = document.getElementById('edit-node-name').value;
    node.location = document.getElementById('edit-node-location').value;
    node.channelID = document.getElementById('edit-node-channel-id').value;
    node.writeAPIKey = document.getElementById('edit-node-api-key').value;
    node.readAPIKey = document.getElementById('edit-node-read-api-key').value;
    node.graphLink = document.getElementById('edit-node-graph-link').value;
    node.length = document.getElementById('edit-node-length').value;
    node.breadth = document.getElementById('edit-node-breadth').value;
    node.depth = document.getElementById('edit-node-depth').value;
    node.radius = document.getElementById('edit-node-radius').value;
    node.volume = document.getElementById('edit-node-volume').value;
    node.qrDetails = document.getElementById('edit-node-qr-details').value;
    node.wifiName = document.getElementById('edit-node-wifi-name').value;
    node.password = document.getElementById('edit-node-password').value;
    node.mode = document.getElementById('edit-node-mode').value;
    localStorage.setItem('nodes', JSON.stringify(nodes));
    closeModal();
    displayNodes();
};

// Function to delete a node
function deleteNode(index) {
    nodes.splice(index, 1);
    localStorage.setItem('nodes', JSON.stringify(nodes));
    displayNodes();
}

// Function to open the View Details modal
function openViewDetailsModal(index) {
    const node = nodes[index];
    document.getElementById('details-name').innerText = node.name;
    document.getElementById('details-location').innerText = node.location;
    document.getElementById('details-status').innerText = node.status;
    document.getElementById('details-last-reading').innerText = 'N/A'; // Placeholder for actual data
    document.getElementById('details-last-value').innerText = 'N/A'; // Placeholder for actual data
    document.getElementById('details-channel-id').innerText = node.channelID;
    document.getElementById('details-write-api-key').innerText = node.writeAPIKey;
    document.getElementById('details-read-api-key').innerText = node.readAPIKey;
    document.getElementById('details-graph-link').href = node.graphLink;
    document.getElementById('details-graph-frame').src = node.graphLink;
    document.getElementById('details-length').innerText = node.length;
    document.getElementById('details-breadth').innerText = node.breadth;
    document.getElementById('details-depth').innerText = node.depth;
    document.getElementById('details-radius').innerText = node.radius;
    document.getElementById('details-volume').innerText = node.volume;
    document.getElementById('details-qr-details').innerText = node.qrDetails;
    document.getElementById('details-wifi-name').innerText = node.wifiName;
    document.getElementById('details-password').innerText = node.password;
    document.getElementById('details-mode').innerText = node.mode;
    document.getElementById('view-details-modal').style.display = 'block';
}

