var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?key=0Ao3Ts9D8bHHpdDQ4RzMzQ0pLTmJ6OUh6UVBNbkFPc3c&output=html';

var app = {};
var MDHouseDistricts = {};
var frozenDist;
var twoClicksAgo;
var freeze=0;
var houseLayer;
var latitude = 38.82;
var longitude = -77.28;
var latLng = new L.LatLng(latitude, longitude);
var sidebar = $('#sidebar');
var map = L.map('map')
  .setView(latLng, 8);
var $mapHelp = $("#map-help");
var $endorseHelp = $("#endorsement-process")


$(document).ready( function() {
  var defaultText =$("#template-default-text").html();
  var sourcebox = $("#template-infobox").html();
  var endorseText = $("#template-endorse-text").html();
  app.infoboxTemplate = Handlebars.compile(sourcebox);
  app.defaultTemplate = Handlebars.compile(defaultText);
  app.endorseTemplate = Handlebars.compile(endorseText);
  Tabletop.init( { key: public_spreadsheet_url,
    callback: showInfo,
    parseNumbers: true } );
});

function showInfo(data, tabletop) {
  $.each( tabletop.sheets("MD 2014 Endorsements").all(), function(i, member) {
    MDHouseDistricts[member.district] = member;
  });

//  console.log("MDHouseDistricts", MDHouseDistricts);
  loadGeo();
//     processJSON(tabletop.sheets("Sheet1").all());
}

// Remap the color from the spreadsheet to a more desirable color
var remapColor = function(color) {
  if (color =="#FFFFBF") {
    color= '#fff4c1';
  }
  return color;
}

var geoStyle = function(data) {
//   console.log('data', data);
  console.log('-------------------');
//   console.log('MDHouseDistricts',MDHouseDistricts);
  var sldlst = data.properties.SLDLST;
  sldlst = sldlst.replace(/^0+/, '');
//   var convertedSLDLST = Number(sldlst);
//   if(convertedSLDLST){
//    sldlst = convertedSLDLST;
//   }
  //console.log(sldlst);
  //console.log('-------------------');

  var houseDistrict = MDHouseDistricts[sldlst];
  console.log('geoStyle houseDistrict', houseDistrict);

  var color = 'white';

  if(houseDistrict) {
    color = remapColor(houseDistrict.colormethod);

//    color='#0B8973';
  }
console.log('housedistrict.....', houseDistrict.district);

  return {
    fillColor: color,
    weight: 1,
    opacity: 0.3,
    color: '#555555',
    dashArray: '0',
    fillOpacity: 1
  }
};

function loadGeo(district) {
  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 17,
    minZoom:8,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mroswell.i6hfjp09'
  }).addTo(map);
  //'examples.map-9ijuk24y'

  houseLayer = L.geoJson(mdHouse, {
    onEachFeature:onEachFeature,
    style: geoStyle
  });

  houseLayer.addTo(map);
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: mapMemberDetailClick,
    dblclick: mapDblClick
  });
}

function checkColor(layer) {
  if (layer.options) {
    return layer.options.fillColor;
  } else if (layer._layers) {
    for (var polyID in layer._layers) {
      return layer._layers[polyID].options.fillColor;
    }
  }
}


function highlightFeature(e) {
  var layer = e.target;
  var color = checkColor(layer);
  if (layer.options) {console.log("---yes---")} else {console.log("---NO---")}
  var districtNumber = layer.feature.properties.SLDLST;
  districtNumber = districtNumber.replace(/^0+/, '');
  var memberDetail = MDHouseDistricts[districtNumber];
  if(!memberDetail){
    console.log(districtNumber);
    return;
  }
  var html;

//  console.log("highlightFeature: ", layer);

  html = "<div class='highlightFeatureInfo'>";
  html += "<strong> District " + memberDetail.district + "</strong>";
  html += "</div>";

  $('.info').html(html);

  layer.setStyle({
    weight: 5,
    color: '#b7907f',
    dashArray: '',
    fillOpacity: 0.4
  });
  if (!freeze) {
    html = app.infoboxTemplate(memberDetail);
    $('#sidebar').html(html);


    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
    info.update(layer.feature.properties);
  }
}



function resetHighlight(e) {
  if (typeof frozenDist == 'object' && freeze) {
    twoClicksAgo = _.clone(frozenDist);
  }
  info.update();
  var layer = e.target;
  console.log("resetHighlight:e :::--:--:--:",e);
//  houseLayer.resetStyle(layer);
  houseLayer.resetStyle(layer);
  info.update();
  if (!freeze) {
    clearInfobox();
  }
  console.log("resetHighlight: frozenDist",frozenDist);

  if (typeof frozenDist == 'object' && freeze) {
    var frozenDistrictNumber = frozenDist.target.feature.properties.SLDLST.replace(/^0+/, '');
    var frozenDistrictDetail = MDHouseDistricts[frozenDistrictNumber];
    frozenDist.target.setStyle({
      fillColor: remapColor(frozenDistrictDetail.colormethod),
      weight: 5,
      opacity: 0.3,
      color: '#666',
      dashArray: '0',
      fillOpacity:.4
    })
}
}

function clearInfobox() {
  sidebar.html(' ');
}

function mapMemberDetailClick(e) {
  freeze=1;
  var boundary = e.target;
  frozenDist = _.clone(boundary);
  console.log("FrOZEN", frozenDist);
  var districtNumber = boundary.feature.properties.SLDLST.replace(/^0+/, '');
  var districtDetail = MDHouseDistricts[districtNumber];
  var member = memberDetailFunction(districtNumber);
  console.log("::::::",e);
  console.log(boundary.getBounds().toBBoxString());

//  houseLayer.resetStyle(frozenDist.target);
  if (twoClicksAgo) {
   houseLayer.resetStyle(twoClicksAgo.target);
  }
  boundary.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.4
  });
  frozenDist = _.clone(e);
  console.log("FrOZEN", frozenDist);
  console.log("BOUNDARY", boundary);
}

function memberDetailFunction(districtNumber){
  var districtDetail = MDHouseDistricts[districtNumber];
  // 1. Build Template for the information box from districtDetails attributes.
  var html = app.infoboxTemplate(districtDetail);
  // 2. Insert the rendered template into #sidebar
  $('#sidebar').html(html);
}

function mapDblClick(e) {
  var layer = e.target;
  var districtNumber = layer.feature.properties.SLDLST;
  districtNumber = districtNumber.replace(/^0+/, '');

  var bbox = layer.getBounds();
  map.fitBounds(bbox);
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.3
  });
//  console.log("DBL", bbox.toBBoxString())
  mapMemberDetailClick(e);
}

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};
//   // method that we will use to update the control based on feature properties passed
info.update = function (props) {
};

info.setPosition('bottomleft').addTo(map);


$mapHelp.click(function() {
  var html = app.defaultTemplate({});
  $('#sidebar').html(html);
  freeze=false;
});

$mapHelp.hover(function() {
  var html = app.defaultTemplate({});
  $('#sidebar').html(html);
  freeze=false;
});

$endorseHelp.click(function() {
  var html = app.endorseTemplate({});
  $('#sidebar').html(html);
  freeze=false;
});

$endorseHelp.hover(function() {
  var html = app.endorseTemplate({});
  $('#sidebar').html(html);
  freeze=false;
});

$(document).on("click",".close",function(event) {
  event.preventDefault();
  clearInfobox();
  freeze=0;
});
