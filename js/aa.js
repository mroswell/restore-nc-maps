var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?key=0Ao3Ts9D8bHHpdDQ4RzMzQ0pLTmJ6OUh6UVBNbkFPc3c&output=html';

var app = {};
var MDHouseDistricts = {};
var frozenDist;
var twoClicksAgo;
var freeze=0;
var houseLayer;
var latitude = 39;
var longitude = -76.6;
var latLng = new L.LatLng(latitude, longitude);
var map = L.map('map')
  .setView(latLng, 10);
var $sidebar = $('#sidebar');
var $mapHelp = $("#map-help");
var $endorseHelp = $("#endorsement-process");


$(document).ready( function() {
loadGeo();
  var defaultText =$("#template-default-text").html();
  var sourcebox = $("#template-infobox").html();
  var endorseText = $("#template-endorse-text").html();
  app.infoboxTemplate = Handlebars.compile(sourcebox);
  app.defaultTemplate = Handlebars.compile(defaultText);
  app.endorseTemplate = Handlebars.compile(endorseText);
//  Tabletop.init( { key: public_spreadsheet_url,
//    callback: showInfo,
//    parseNumbers: true } );
});


function loadGeo(district) {
  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 17,
    minZoom:9,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mroswell.i6hfjp09'
  }).addTo(map);
  //'examples.map-9ijuk24y'

  var myStyle = {
    fillColor: '#FFEBCD',
    //'#ddd7b8',
    weight: 1,
    opacity: 0.3,
    color: '#555555',
    dashArray: '0',
    fillOpacity:1
  };

//console.log(aa4);
// L.geoJson(aa_council_districts, {
//    style: myStyle
//  }).addTo(map);
  L.geoJson(aa, {
    onEachFeature:onEachFeature,
    style: myStyle
  }).addTo(map);

//  aaLayer.addTo(map);

}

//  ;
//    , {
//    onEachFeature:onEachFeature
//
//  });

//}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature
//    mouseout: resetHighlight,
//    click: mapMemberDetailClick,
//    dblclick: mapDblClick
  });
}

function highlightFeature(e) {
  var layer = e.target;
//  var districtNumber = layer.feature.properties.CNCL;
//  districtNumber = districtNumber.replace(/^0+/, '');
//  var memberDetail = MDHouseDistricts[districtNumber];
//  if(!memberDetail){
//    return;
//  }
//  var html;
//  html = "<div class='highlightFeatureInfo'>";
//  html += "<strong> District " + memberDetail.district + "</strong>";
//  html += "</div>";
//
//  $('.info').html(html);

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.2
  });
//  if (!freeze) {
//    html = app.infoboxTemplate(memberDetail);
//    $('#sidebar').html(html);
//    if (!L.Browser.ie && !L.Browser.opera) {
//      layer.bringToFront();
//    }
//    info.update(layer.feature.properties);
//  }
}
//
//function resetHighlight(e) {
//  info.update();
//  var layer = e.target;
////  houseLayer.resetStyle(layer);
//  houseLayer.resetStyle(layer);
//  info.update();
//  if (!freeze) {
//    clearInfobox(e);
//  }
//
//  styleDistrict(frozenDist,5,0.3,'#b7907f',0.25);
//}
//
//function clearInfobox() {
//  $sidebar.html(' ');
//  styleDistrict(frozenDist,1,0.3,'#666',1);
//}
//
//function styleDistrict(whichDist, weight, opacity, color, fillOpacity) {
//  if (typeof frozenDist == 'object' && freeze) {
//    var frozenDistrictNumber = frozenDist.target.feature.properties.SLDLST.replace(/^0+/, '');
//    var frozenDistrictDetail = MDHouseDistricts[frozenDistrictNumber];
//    frozenDist.target.setStyle({
//      fillColor: remapColor(frozenDistrictDetail.colormethod),
//      weight: weight,
//      opacity: opacity,
//      color: color,
////      dashArray: '0',
//      fillOpacity:fillOpacity
//    })
//  }
//}
//
//function mapMemberDetailClick(e) {
//  if (typeof frozenDist == 'object' && freeze) {
//    twoClicksAgo = _.clone(frozenDist);
//  }
//  freeze=1;
//  var boundary = e.target;
//  var districtNumber = boundary.feature.properties.SLDLST.replace(/^0+/, '');
//  var districtDetail = MDHouseDistricts[districtNumber];
//  var member = memberDetailFunction(districtNumber);
//  if (twoClicksAgo) {
//   houseLayer.resetStyle(twoClicksAgo.target);
//  }
//  boundary.setStyle({
//    weight: 5,
//    color: '#b7907f',
////    dashArray: '',
//    fillOpacity: 0.1
//  });
//  frozenDist = _.clone(e);
//}
//
//function memberDetailFunction(districtNumber){
//  var districtDetail = MDHouseDistricts[districtNumber];
//  // 1. Build Template for the information box from districtDetails attributes.
//  var html = app.infoboxTemplate(districtDetail);
//  // 2. Insert the rendered template into #sidebar
//  $('#sidebar').html(html);
//}
//
//function mapDblClick(e) {
//  var layer = e.target;
//  var districtNumber = layer.feature.properties.SLDLST;
//  districtNumber = districtNumber.replace(/^0+/, '');
//  var bbox = layer.getBounds();
//  map.fitBounds(bbox);
//  layer.setStyle({
//    weight: 5,
//    color: '#666',
////    dashArray: '',
//    fillOpacity: 0.2
//  });
//  mapMemberDetailClick(e);
//}
//
//var info = L.control();
//
//info.onAdd = function (map) {
//  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//  this.update();
//  return this._div;
//};
////   // method that we will use to update the control based on feature properties passed
//info.update = function (props) {
//};
//
//info.setPosition('bottomleft').addTo(map);

$mapHelp.click(function() {
  var html = app.defaultTemplate({});
  $('#sidebar').html(html);
  freeze=false;
});

$endorseHelp.click(function() {
  var html = app.endorseTemplate({});
  $('#sidebar').html(html);
  freeze=false;
});

$(document).on("click",".close",function(event) {
  event.preventDefault();
  clearInfobox();
  freeze=0;
});
