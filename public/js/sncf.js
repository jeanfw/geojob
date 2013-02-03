function cleanupXML(object) {
  var clean = {};
  
  if ((typeof object == "object") && ('length' in object)) {
    // Array
    clean = (object.length == 1) ? cleanupXML(object[0]) : object.map(cleanupXML);
  } else if (typeof object == "object") {
    // Object but not array
    Object.getOwnPropertyNames(object).forEach(function(property) {
      if (property == "$") {
        clean = $.extend(clean, cleanupXML(object[property]));
      } else {
        clean[property] = cleanupXML(object[property]);
      }
    });
  } else {
    // Neither an object nor an array, so let's just return it
    clean = object;
  }
  
  return clean;
}


function sncfNearbyStations(x, y, callback) {

  // Call the API
  $.getJSON(
  
    '/apis/tersncf/nearby_stations', 
    
    {
      x: x,
      y: y // @FIX ME: Distance not handled well in controller
    }
    
  )
  
  // Success
  .done(function(data) {
  
    var stations = [];
    
    // array d'objets [ { distance: 830, station: { city: ... , etc } } ]
  
    // console.log(data);
    
    stations = cleanupXML(data).ActionProximityList.ProximityList.Proximity;
    
    console.log(stations);
    
    callback(null, stations);
    
  })
  
  // Handle failed queries
  .fail(function(data, response) {
  
    // Callback with error
    callback(response);
    
  });
  
  
}


function sncfRouteList(start, end, callback) {

  // Call the API
  $.getJSON(
  
    '/apis/tersncf/route_list', 
    
    {
      start: start,
      end  : end
    }
    
  )
  
  // Success
  .done(function(data) {
  
    // console.log(data);
  
    var routes = [];
    
    routes = cleanupXML(data).ActionRouteList.RouteList.Route;
    
    // console.log(routes);
    
    callback(null, routes);
    
  })
  
  // Handle failed queries
  .fail(function(data, response) {
  
    // Callback with error
    callback(response);
    
  });
  
  
}
