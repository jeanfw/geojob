var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , restler    = require('restler')
  , parseXML   = require('xml2js').parseString;

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
      
      if (options.distance) request_options.query.Distance = distance;
      
      this
      .get('http://ms.api.ter-sncf.com/', request_options)
      .on('error', function(err, response) {
        console.error(err);
        callback(err);
      })
      .on('fail', function(err, response) {
        callback(new Error('Failed TER SNCF API call'));
      })
      .on('success', function(result, response) {
      
        // console.log(result);
        
        parseXML(result, callback);
        
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
    
    keywordSearch: function(keyword, callback) {
      
      this
      .get('http://www.zijob.fr/api/jobsearch', { query: { "response_format": "json", job_search_keyword: keyword }})
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
  
  if (self.param('keyword'))
    zijob.keywordSearch(self.param('keyword'), function(err, result) {
      if (err) console.error(err);
      else {
        console.log(result);
        self.response.json(result);
      }
    });

  else if (self.param('category'))
    self.response.json({ error: 'not enabled yet' });
  
  else
    self.response.json({ error: 'please specify a keyword' });
  
}

ApisController.tersncfNearbyStations = function() {
  var self = this;
  
  if (self.param('x') && self.param('y')) { 
    var options = self.param('distance') || {};
    tersncf.getNearbyStations(self.param('x'), self.param('y'), options, function(err, result) {
      if (err) {
        console.error(err);
        self.response.json({ error: 'Parse XML reported error: ' + err });
      } else {
        // console.log(result);
        self.response.json(result);
      }
    });
  }

  else if (self.param('category'))
    self.response.json({ error: 'not enabled yet' });
  
  else
    self.response.json({ error: 'please specify x, y and optionally distance' });
  
}

module.exports = ApisController;
