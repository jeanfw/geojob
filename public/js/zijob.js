function zijobKeywordSearch(keyword, callback) {

  // Call the API
  $.get(
  
    'http://www.zijob.fr/api/jobsearch', 
    
    { 
      response_format: 'json', 
      job_search_keyword: keyword  
    }
    
  )
  
  // Success
  .done(function(data) {
    
    var jobs = [];
    
    jobs = data.response.jobs.job;
    
    // Callback passing the data back
    callback(null, jobs);
    
  })
  
  // Handle failed queries
  .fail(function(data, response) {
  
    // Callback with error
    callback(response);
    
  });
  
  
}
