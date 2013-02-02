function sncfNearbyStations(x, y, callback) {

  // Call the API
  $.getJSON(
  
    '/apis/tersncf/nearby_stations', 
    
    {
      x: x,
      y: y, 
      distance: 10000
    }
    
  )
  
  // Success
  .done(function(data) {
  
    var stations = [];
    
    // array d'objets [ { distance: 830, station: { city: ... , etc } } ]
  
    stations = data.ActionProximityList.ProximityList[0].Proximity.map(function(proximityItem) {
      return {
        distance: proximityItem.$.Distance,
        stop_point: proximityItem.StopPoint[0]
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
