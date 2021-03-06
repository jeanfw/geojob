// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
module.exports = function routes() {
  this.root('pages#main');
  this.match('/apis/zijob/jobsearch', 'apis#zijob_job_search');
  this.match('/apis/tersncf/nearby_stations', 'apis#tersncf_nearby_stations');
  this.match('/apis/tersncf/route_list', 'apis#tersncf_route_list');
  this.match('/apis/tersncf/vehicle_journey_list', 'apis#tersncf_vehicle_journey_list');
}
