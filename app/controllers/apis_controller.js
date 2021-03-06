var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , restler    = require('restler')
  , parseXML   = require('xml2js').parseString;
  
function cleanupJSON(object) {
  var clean = {};
  
  if ((typeof object == "object") && ('length' in object)) {
    // Array
    clean = (object.length == 1) ? cleanupJSON(object[0]) : object.map(cleanupJSON);
  } else if (typeof object == "object") {
    // Object but not array
    Object.getOwnPropertyNames(object).forEach(function(property) {
      if (property == "$") {
        // clean = cleanupJSON(object[property]);
        Object.getOwnPropertyNames(object[property]).forEach(function(subproperty) {
          clean[subproperty] = cleanupJSON(object[property][subproperty]);
        })
      } else {
        clean[property] = cleanupJSON(object[property]);
      }
    });
  } else {
    // Neither an object nor an array, so let's just return it
    clean = object;
  }
  
  return clean;
}

function parseAndcleanupXML(xml, callback) {
  parseXML(xml, function(err, dirty_json) {
    if (err) 
      callback(err);
    else {
      console.log(dirty_json);
      var clean_json = cleanupJSON(dirty_json);
      callback(null, clean_json);
    }
  })
}

var ApisController = new Controller();

var TerSNCFService = restler.service(
  
  // Constructor
  function(options) {
    this.options = options || {};
  }, 
  
  // Params
  {
    
  }, 
  
  {
    
    getNearbyStations: function(x, y, options, callback) {
      
      // http://ms.api.ter-sncf.com/?Action=ProximityList&Type=StopPoint&X=597161&Y=2543937
      
      var request_options = { query: { "Action": "ProximityList", "Type": "StopPoint", "X": x, "Y": y } };
      
      request_options.query.Distance = options.distance || 10000;
      
      console.log(request_options);
      
      this
      .get('http://ms.api.ter-sncf.com/', request_options)
      .on('error', function(err, response) {
        console.error(err);
        callback(err);
      })
      .on('fail', function(err, response) {
        callback(new Error('Failed TER SNCF API ProximityList call'));
      })
      .on('success', function(result, response) {
      
        // console.log(result);
        
        parseAndcleanupXML(result, callback);
        
      });
    },
    
    getRouteList: function(start, end, options, callback) {
      
      // http://ms.api.ter-sncf.com/?action=RouteList&StopAreaExternalCode=OCE87391003;OCE87394007|and&CheckOrder=TRUE

      
      var request_options = { query: { "Action": "RouteList", "CheckOrder": "TRUE", "StopAreaExternalCode": start + ";" + end + "|and" } };
      
      // if (options.distance) request_options.query.Distance = distance;
      
      this
      .get('http://ms.api.ter-sncf.com/', request_options)
      .on('error', function(err, response) {
        console.error(err);
        callback(err);
      })
      .on('fail', function(err, response) {
        callback(new Error('Failed TER SNCF API RouteList call'));
      })
      .on('success', function(result, response) {
      
        // console.log(result);
        
        parseAndcleanupXML(result, callback);
        
      });
    }, 
    
    getVehicleJourneyList: function(start, end, route_external_code, options, callback) {
      
      // http://ms.api.ter-sncf.com/?action=VehicleJourneyList&RouteExternalCode=OCETrainTER-87391003-87394007-1;xxx&StopAreaExternalCode=OCE87391003;OCE87394007|and&ShowStop=TRUE&StartTime=08|00&EndTime=10|10&Date=2013|02|05

      
      var request_options = { 
        query: { 
          "Action": "VehicleJourneyList", 
          "ShowStop": "TRUE", 
          "RouteExternalCode" : route_external_code,
          "StopAreaExternalCode": start + ";" + end + "|and", 
          "Date" : "2013|02|05", 
          "StartTime": options.start_time || "05|00",
          "EndTime"  : options.end_time   || "09|00"
        } 
      };
      
      // if (options.distance) request_options.query.Distance = distance;
      
      this
      .get('http://ms.api.ter-sncf.com/', request_options)
      .on('error', function(err, response) {
        console.error(err);
        callback(err);
      })
      .on('fail', function(err, response) {
        callback(new Error('Failed TER SNCF API VehicleJourneyList call'));
      })
      .on('success', function(result, response) {
      
        // console.log(result);
        
        parseAndcleanupXML(result, callback);
        
      });
    }, 
    
    
    
  }
  
);

var ZijobService = restler.service(
  
  // Constructor
  function(options) {
    this.options = options || {};
  }, 
  
  // Params
  {
    
  }, 
  
  {
    
    keywordSearch: function(keyword, region, callback) {
      
      this
      .get('http://www.zijob.fr/api/jobsearch', { query: { "response_format": "json", job_search_keyword: keyword, job_search_limit: 30, job_search_location: region }})
      .on('error', function(err, response) {
        console.error(err);
        callback(err);
      })
      .on('fail', function(err, response) {
        callback(new Error('Failed Zijob API call'));
      })
      .on('success', function(result, response) {
        result = JSON.parse(result); 
        var jobs = (result.response && ('jobs' in result.response) && ('job' in result.response.jobs)) ? result.response.jobs.job : [];
        if (jobs != undefined && jobs.length > 0)
          callback(null, jobs);
        else 
          callback(null, []);
      });
    }, 
    
  }
  
);

var zijob = new ZijobService();
var tersncf = new TerSNCFService();

ApisController.zijobJobSearch = function() {
  var self = this;
  
  if (self.param('keyword') && self.param('region'))
    zijob.keywordSearch(self.param('keyword'), self.param('region'), function(err, result) {
      if (err) console.error(err);
      else {
        console.log(result);
        self.response.json(result);
      }
    });

  else if (self.param('category'))
    self.response.json({ error: 'not enabled yet' });
  
  else
    self.response.json({ error: 'please specify a keyword and region' });
  
}

ApisController.tersncfNearbyStations = function() {
  var self = this;
  
  
  if (self.param('x') && self.param('y')) {
    
    // console.log(options);
    
    tersncf.getNearbyStations(self.param('x'), self.param('y'), {}, function(err, result) {
      if (err) {
        console.error(err);
        self.response.json({ error: 'Parse XML reported error: ' + err });
      } else {
        // console.log(result);
        self.response.json(result);
      }
    });
  }
  
  else
    self.response.json({ error: 'please specify x, y and optionally distance' });
  
}

ApisController.tersncfRouteList = function() {
  var self = this;
  
  if (self.param('start') && self.param('end')) { 
    var options = {};
    tersncf.getRouteList(self.param('start'), self.param('end'), options, function(err, result) {
      if (err) {
        console.error(err);
        self.response.json({ error: 'Parse XML reported error: ' + err });
      } else {
        // console.log(result);
        self.response.json(result);
      }
    });
  }
  
  else
    self.response.json({ error: 'please specify start, end' });
  
}

ApisController.tersncfVehicleJourneyList = function() {
  var self = this;
  
  if (self.param('start') && self.param('end')) { 
    var options = self.param('options') || {};
    tersncf.getVehicleJourneyList(self.param('start'), self.param('end'), self.param('route') || "", options, function(err, result) {
      if (err) {
        console.error(err);
        self.response.json({ error: 'Parse XML reported error: ' + err });
      } else {
        // console.log(result);
        self.response.json(result);
      }
    });
  }
  
  else
    self.response.json({ error: 'please specify start, end and route' });
  
}

module.exports = ApisController;
