// menu / sidebar code
// MY ORIGINAL CODE:

var menuIcon = document.getElementById('menuIcon');

document.getElementById("menuIcon").onclick = openNav;
function openNav() {
  if (window.innerWidth <= 800) {
    document.getElementById("nav").style.height = "9em"
    document.getElementById("main").style.marginTop = "21%";
    document.getElementById("main").style.height = "77%"
  }else{
    document.getElementById("nav").style.width = "20%"
    document.getElementById("main").style.marginLeft = "20%";
    document.getElementById("main").style.width = "78%"
  }
  document.querySelectorAll(".link").forEach(link => {
    link.style.display = "block";
  });
  document.getElementById("closeIcon").style.display = "block";
  document.getElementById("menuIcon").style.display = "none";
}

document.getElementById("closeIcon").onclick = closeNav;
function closeNav() {
  if (window.innerWidth<= 800){
    document.getElementById("nav").style.height = "0";
    document.getElementById("main").style.marginTop = "0";
    document.getElementById("main").style.height = "100%";

  }else{
    document.getElementById("nav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("main").style.width = "100%";
  }
  document.querySelectorAll(".link").forEach(link => {
    link.style.display = "none";
  });
  document.getElementById("closeIcon").style.display = "none";
  document.getElementById("menuIcon").style.display = "inline-block";
}

// end my code

// MAP CODE CREDIT: https://leafletjs.com/examples/quick-start/  https://leafletjs.com/examples/accessibility/ //
// FIREBASE CREDIT: https://firebase.google.com/docs/web/setup //

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

//got from firebase site
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

//got from leaflet
var map = L.map('map').setView([40.7128, -74.006], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var customIcon = L.icon({
  iconUrl: 'images/marker.png',
  iconSize: [30, 40],
  iconAnchor: [15, 39],
  popupAnchor: [-10, -30]
  });

let allMarkers = [];

//load in the pins, from leaflet site
var loadPins = async () => {
  var snapshot = await getDocs(pinsRef);
  snapshot.forEach(doc => {
    var { lat, lng, content } = doc.data();
    var marker = L.marker([lat, lng], {icon: customIcon}).addTo(map);
    marker.bindPopup(content);
    allMarkers.push(marker);
  });
};
loadPins();

//from leaflet:
map.on('click', (e) => {
  var { lat, lng } = e.latlng;

  var formHtml = `
    <form id="pin-form">
      <textarea id="description" rows="4" placeholder="Embed a song and add a description..."></textarea><br/>
      <button type="submit">Add Pin</button>
    </form>
  `;

  var popup = L.popup()
    .setLatLng([lat, lng])
    .setContent(formHtml)
    .openOn(map);

    var form = document.getElementById('pin-form');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      var desc = document.getElementById('description').value;

      var marker = L.marker([lat, lng], {icon: customIcon}).addTo(map);
      {alt: userEmbed(desc)}
      marker.bindPopup(userEmbed(desc)).openPopup();

      allMarkers.push(marker);
      map.closePopup();

      addDoc(pinsRef, { lat, lng, content: desc });
    });
});

function userEmbed(content) {
  var iframeRegex = /<iframe[^>]+src="([^"]+)"/;
}

// END CREDIT //
