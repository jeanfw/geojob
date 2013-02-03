function zijobKeywordSearch(keyword, region, callback) {

  // Call the API
  $.getJSON(
  
    '/apis/zijob/jobsearch', 
    
    {
      keyword: keyword, 
      region: region, 
    }
    
  )
  
  // Success
  .done(function(data) {
    
    callback(null, data);
    
  })
  
  // Handle failed queries
  .fail(function(data, response) {
  
    // Callback with error
    callback(response);
    
  });
  
  
}
