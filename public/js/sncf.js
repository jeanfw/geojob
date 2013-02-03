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
  
    var routes = data.ActionRouteList.RouteList.Route;
    
    if ((routes != undefined) && ('length' in routes) && (routes.length > 0)) { 
      routes = routes.map(function(route) {
        return route.RouteExternalCode;
      });
    } else {
      routes = [];
    }
    
    // console.log(routes);
    
    callback(null, routes);
    
  })
  
  // Handle failed queries
  .fail(function(data, response) {
  
    // Callback with error
    callback(response);
    
  });
  
  
}


function sncfVehicleJourney(start, end, route, callback){
  $.getJSON(
  
    '/apis/tersncf/vehicle_journey_list',
    
    {
     start: start,
     end: end,
     route: route
    }
    
   )
   //success
   .done(function(data){
     var vehicles=[];
      
     if ((data.ActionVehicleJourneyList.VehicleJourneyList) && (data.ActionVehicleJourneyList.VehicleJourneyList.VehicleJourneyCount > 0) && (data.ActionVehicleJourneyList.VehicleJourneyList.VehicleJourney.length > 0))
       vehicles = data.ActionVehicleJourneyList.VehicleJourneyList.VehicleJourney.map(function(VehicleJourneyItem){
         var stoptime;
         var stoparea;
         var stoppoint;
         // var length=VehicleJourneyItem.StopList.StopCount;
         // console.log("length: "+length);
         
         var all_stops = [], start_stop = {}, end_stop = {};
         all_stops = VehicleJourneyItem.StopList.Stop.map(function(stop) {
           var stop_time;
           
           var stop_object = {
             stop_area_external_code: stop.StopPoint.StopArea.StopAreaExternalCode,
             stop_area_name:          stop.StopPoint.StopArea.StopAreaName,
             stop_time: stop.StopTime.TotalSeconds || stop.StopArrivalTime.TotalSeconds, 
             stop_point: stop.StopPoint,
             // details: stop.StopPoint
           };
           if (stop_object.stop_area_external_code == start) {
             start_stop = stop_object;
           } else if (stop_object.stop_area_external_code == end) {
             end_stop = stop_object;
           }
           return stop_object;
         });
         
         return {
           line: VehicleJourneyItem.Route.Line,
           modetype: VehicleJourneyItem.Route.Line.ModeType,
           all_stop: all_stops,
           start_stop: start_stop,
           end_stop: end_stop, 
           journey_time_seconds: (end_stop.stop_time-start_stop.stop_time)
         }
       });
     
     else 
       vehicles = [];
     
     // console.log(vehicles);
     callback(null, vehicles);
   })
  // Handle failed queries
  .fail(function(data, response) {
    // Callback with error
    callback(response);
  });
}