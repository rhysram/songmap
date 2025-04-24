import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAqMK5Z15KAxy3VM47xbb-26BRnfkZxMMY",
  authDomain: "song-map-4fd56.firebaseapp.com",
  projectId: "song-map-4fd56",
  storageBucket: "song-map-4fd56.appspot.com",
  messagingSenderId: "15828329855",
  appId: "1:15828329855:web:04849551b71b29d7ac264a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pinsRef = collection(db, "mapPins");

// Initialize Leaflet map
const map = L.map('map').setView([40.7128, -74.006], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Store markers
let allMarkers = [];

// Load existing pins
const loadPins = async () => {
  const snapshot = await getDocs(pinsRef);
  snapshot.forEach(doc => {
    const { lat, lng, content } = doc.data();
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(content);
    allMarkers.push(marker);
  });
};
loadPins();

// Add pin on map click
map.on('click', (e) => {
  const { lat, lng } = e.latlng;

  const formHtml = `
    <form id="pin-form">
      <textarea id="description" rows="4" placeholder="Add a description or embed iframe..."></textarea><br/>
      <button type="submit">Add Pin</button>
    </form>
  `;

  const popup = L.popup()
    .setLatLng([lat, lng])
    .setContent(formHtml)
    .openOn(map);

  setTimeout(() => {
    const form = document.getElementById('pin-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const desc = document.getElementById('description').value;

      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(makeResponsiveEmbed(desc)).openPopup();

      allMarkers.push(marker);
      map.closePopup();

      try {
        await addDoc(pinsRef, { lat, lng, content: desc });
      } catch (err) {
        console.error("Error saving pin:", err);
      }
    });
  }, 100);
});

// Function to make iframe content responsive
function makeResponsiveEmbed(content) {
  const iframeRegex = /<iframe[^>]+src="([^"]+)"/;
  const match = content.match(iframeRegex);
  
  if (match) {
    // Create a wrapper for the iframe
    const wrapper = `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; max-width:100%;"><iframe src="${match[1]}" frameborder="0" style="position:absolute; top:0; left:0; width:100%; height:100%;"></iframe></div>`;
    return `<div class="popup-content">${wrapper}</div>`; // Wrap it with class for additional styling
  }
  return `<div class="popup-content">${content}</div>`; // Return the description if no iframe found
}
