<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flight Tracker</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
    body, html { margin:0; padding:0; font-family: Arial, sans-serif; }

    /* Sidebar */
    #sidebar {
        width: 250px;
        height: 100vh;
        background: #111;
        color: #fff;
        float:left;
        display:flex;
        flex-direction:column;
    }
    #sidebar button {
        padding:15px;
        border:none;
        background:none;
        color:#fff;
        cursor:pointer;
        text-align:left;
    }
    #sidebar button:hover { background:#333; }

    /* Map */
    #map {
        position:absolute;
        left:250px;
        top:0;
        right:0;
        bottom:0;
    }

    /* Form container */
    #formContainer {
        display:none;
        padding:20px;
        background:#f4f4f4;
        position:absolute;
        top:0;
        left:250px;
        width:calc(100% - 250px);
        height:100vh;
        overflow:auto;
    }
    input, select { padding:8px; margin:5px 0; width:100%; }
</style>
</head>
<body>

<div id="sidebar">
    <button onclick="showSection('home')">Home</button>
    <button onclick="showSection('newFlight')">New Flight</button>
    <button onclick="showSection('traffic')">ADS-B Traffic</button>
    <button onclick="login()">Login</button>
</div>

<div id="map"></div>

<div id="formContainer">
    <h2>New Flight</h2>
    <form id="flightForm">
        <label>Departure Airport</label>
        <input type="text" id="departure" required>
        <label>Arrival Airport</label>
        <input type="text" id="arrival" required>
        <label>Flight Number</label>
        <input type="text" id="flightNumber" required>
        <label>Aircraft</label>
        <input type="text" id="aircraft">
        <label>Airlines</label>
        <input type="text" id="airlines">
        <label>Upload Flight JS</label>
        <input type="file" id="flightFile" accept=".js">
        <button type="submit">Add Flight</button>
    </form>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
// === Leaflet Map setup ===
const map = L.map('map').setView([-25, 134.5], 3);

// Thêm OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Sidebar navigation
function showSection(section) {
    const formContainer = document.getElementById('formContainer');
    if(section === 'newFlight') {
        formContainer.style.display = 'block';
    } else {
        formContainer.style.display = 'none';
    }
}

// Simple login (demo)
function login() {
    const user = prompt("Enter username:");
    if(user) {
        localStorage.setItem('user', user);
        alert("Logged in as " + user);
    }
}

// Layer để vẽ flight route
let flightLayer = null;

// Handle new flight form
document.getElementById('flightForm').addEventListener('submit', async function(e){
    e.preventDefault();
    
    const dep = document.getElementById('departure').value;
    const arr = document.getElementById('arrival').value;
    const flightNum = document.getElementById('flightNumber').value;
    const aircraft = document.getElementById('aircraft').value;
    const airlines = document.getElementById('airlines').value;
    const file = document.getElementById('flightFile').files[0];

    if(file) {
        const content = await file.text();
        console.log('Flight JS content:', content);
        // eval(content); // Cẩn thận nếu muốn chạy JS
    }

    // Demo: vẽ route từ Sydney -> Singapore
    const depCoord = [-33.9, 151.2]; // [lat, lon]
    const arrCoord = [1.36, 103.99];

    // Xóa layer cũ nếu đã tồn tại
    if(flightLayer) map.removeLayer(flightLayer);

    // Tạo polyline route mới
    flightLayer = L.polyline([depCoord, arrCoord], {color:'#FF4136', weight:4}).addTo(map);

    // Zoom map vừa đủ để thấy route
    map.fitBounds(flightLayer.getBounds());

    alert('Flight added: ' + flightNum);
});
</script>

</body>
</html>
