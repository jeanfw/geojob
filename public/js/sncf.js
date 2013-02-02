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
  
    console.log(data);
  
    var proximity = data.ActionProximityList.ProximityList[0].Proximity || [];
    
    stations = proximity.map(function(proximityItem) {
    
      var stop_point = {};
      var stop_point_dirty = proximityItem.StopPoint[0];
      
      stop_point = cleanupXML(stop_point_dirty);
      
      return {
        distance: proximityItem.$.Distance,
        stop_point: stop_point
      }
    });
    
    console.log(stations);
    
    callback(null, stations);
    
  })
  
  // Handle failed queries
  .fail(function(data, response) {
  
    // Callback with error
    callback(response);
    
  });
  
  
}
