
var app = {};

app.initialize = function(){
  // Construire la carte Leaflet.
  this.createMap();
  this.geolocalisation();

  $('#map').on( "pageshow", function(e){
    console.log('Carte affichée...');
    // Ajuster la taille de la carte (nécessaire à cause de jQuery mobile)
    setTimeout(function(){ app.map.invalidateSize(); }, 300); 
  });
};

app.createMap = function(){
  var self = this;

  // Ajuster la hauteur du div qui contiendra la carte.
  var h = $('#map div[data-role=header]').height() + $('#map div[data-role=footer]').height();
  $('#mapdiv-wrapper').css('height', 'calc(100vh - '+h+'px)');

  self.map = L.map('mapdiv', {
    maxBounds: [[45, 5], [48, 9]],
    minZoom: 10,
    maxZoom: 17
  }).setView([46.524, 6.633], 12);

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  }).addTo(self.map);

  // Fix the map display (jQuery mobile issue)
  setTimeout(function(){ self.map.invalidateSize(); }, 300);
  setTimeout(function(){ self.map.invalidateSize(); }, 2000);
};

app.geolocalisation = function(){
  var self = this;
  self.map.locate({setView: false});
  self.map.on('locationfound', self.onLocationFound);
  self.map.on('locationerror', self.onLocationError);
};

app.onLocationError = function(e){
  console.log('Erreur. La géolocalisation ne fonctionne pas.');
};

app.onLocationFound = function(e){
  console.log('Localisation trouvée: ', e);
  // Ajouter un marqueur à la position de l'utilisateur.
  self.currentLocation = e;
  if (self.currentLocationMarker) {
    // Mettre à jour le marqueur existant
    self.currentLocationMarker.setLatLng(e.latlng);
    self.currentLocationAccuracy.setLatLng(e.latlng);
    self.currentLocationAccuracy.setRadius(e.accuracy / 2);
  } else {
    // Créer le marqueur
    var currentLocationIcon = L.icon({
      iconUrl: 'img/current-location.png',
      iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -35]
    });
    self.currentLocationMarker = L.marker(e.latlng, { icon: currentLocationIcon });
    self.currentLocationMarker.addTo(app.map);
    var radius = e.accuracy / 2;
    self.currentLocationAccuracy = L.circle(e.latlng, radius);
    self.currentLocationAccuracy.addTo(app.map);
  }

  // Demander la position de l'utilisateur encore une fois dans un petit moment.
  setTimeout(function(){
    app.map.locate({setView: false});
  }, 5000);
};

app.initialize();
