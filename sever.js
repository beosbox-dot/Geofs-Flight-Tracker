// === FLIGHT TRACKER - Leaflet Version ===

// --- Map setup ---
const map = L.map('map', {
    zoomControl: true,
    minZoom: 2,
    worldCopyJump: true
}).setView([-10, 134.5], 3);

// --- Add tile layer (OpenStreetMap) ---
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// --- Global state ---
let flightLayer = null;
let loggedUser = localStorage.getItem('user') || null;

// --- Sidebar navigation ---
function showSection(section) {
    const formContainer = document.getElementById('formContainer');
    if (section === 'newFlight') {
        formContainer.style.display = 'block';
    } else {
        formContainer.style.display = 'none';
    }
}

// --- Simple login system (demo) ---
function login() {
    const user = prompt("Enter username:");
    if (user) {
        localStorage.setItem('user', user);
        loggedUser = user;
        alert("✅ Logged in as " + user);
    }
}

// --- Smooth marker animation helper ---
function animateRoute(coords) {
    const planeIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/34/34627.png',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const marker = L.marker(coords[0], { icon: planeIcon }).addTo(map);
    let i = 0;

    const interval = setInterval(() => {
        if (i < coords.length - 1) {
            marker.setLatLng(coords[i]);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 300); // tốc độ bay
}

// --- Handle new flight form ---
document.getElementById('flightForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const dep = document.getElementById('departure').value.trim();
    const arr = document.getElementById('arrival').value.trim();
    const flightNum = document.getElementById('flightNumber').value.trim();
    const aircraft = document.getElementById('aircraft').value.trim();
    const airlines = document.getElementById('airlines').value.trim();
    const file = document.getElementById('flightFile').files[0];

    // Đọc file .js nếu có (demo)
    if (file) {
        const content = await file.text();
        console.log(`📄 Loaded JS for ${flightNum}:`, content);
    }

    // --- Demo coordinates (Sydney → Singapore) ---
    const depCoord = [-33.8688, 151.2093]; // Sydney
    const arrCoord = [1.3521, 103.8198];   // Singapore

    // Nếu có flight layer cũ thì xoá trước
    if (flightLayer) map.removeLayer(flightLayer);

    // Tạo route (polyline)
    const routeCoords = [depCoord, arrCoord];
    flightLayer = L.polyline(routeCoords, {
        color: '#FF4136',
        weight: 4,
        opacity: 0.9,
        smoothFactor: 1
    }).addTo(map);

    // Zoom đến route
    map.fitBounds(flightLayer.getBounds(), { padding: [50, 50] });

    // Animate máy bay bay dọc route
    animateRoute(routeCoords);

    // Lưu flight vào localStorage nếu user đã login
    if (loggedUser) {
        const savedFlights = JSON.parse(localStorage.getItem('flights') || '[]');
        savedFlights.push({ dep, arr, flightNum, aircraft, airlines, date: new Date().toISOString() });
        localStorage.setItem('flights', JSON.stringify(savedFlights));
    }

    // Thông báo thành công
    alert(`✈️ Flight added: ${flightNum}\n${airlines} (${aircraft})\n${dep} → ${arr}`);
});
