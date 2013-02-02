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

module.exports = ApisController;
