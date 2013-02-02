function zijobKeywordSearch(keyword, callback) {

  // Call the API
  $.getJSON(
  
    '/apis/zijob/jobsearch', 
    
    {
      keyword: keyword
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
