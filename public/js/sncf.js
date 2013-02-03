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
  
    var stations = data.ActionProximityList.ProximityList.Proximity || [];
    
    // console.log(stations);
    
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
  
    var routes = data.ActionRouteList.RouteList.Route || [];
    
    // console.log(routes);
    
    callback(null, routes);
    
  })
  
  // Handle failed queries
  .fail(function(data, response) {
  
    // Callback with error
    callback(response);
    
  });
  
  
}
