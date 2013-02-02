var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , restler    = require('restler');

var ApisController = new Controller();

var ZijobService = restler.service(
  
  // Constructor
  function(options) {
    this.options = options || {};
  }, 
  
  // Params
  {
    
  }, 
  
  {
    // LinkedIn proxy to get company details
    // https://api.singly.com/proxy/linkedin/companies/{{id}}:(id,name,website-url,industries,square-logo-url,specialties,locations)?format=json&access_token=...
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
        callback(null, jobs);
      });
    }, 
    
  }
  
);

var zijob = new ZijobService();

ApisController.zijobJobSearch = function() {
  var self = this;
  
  zijob.keywordSearch(self.param('keyword'), function(err, result) {
    if (err) console.error(err);
    else {
      console.log(result);
      self.response.json(result);
    }
  });
  
  
}

module.exports = ApisController;
