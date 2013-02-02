  getLamb2 = function(postalcode, callbackFunction){
      var result=new Array();
        var query="http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.placefinder%20where%20postal%3D%22"+ postalcode +"%22%20and%20country%3D%22France%22&format=json&diagnostics=true.callback=cbfunc";
        $.getJSON(query, 
         function(data){
           var lat = data.query.results.Result.longitude;
           var lng = data.query.results.Result.latitude;
         
           var CoordSystem = 1;
           var la_Lambert = new Array();
           if (parseInt(CoordSystem, 10) != 6)
             la_Lambert = WGS_ED50(lat, lng);
           else {
             la_Lambert[0] = 6.346528978762258;
             la_Lambert[1] = 49.26103353375895;
           }
           if(typeof callbackFunction == 'function')
           {
              callbackFunction.call(this, la_Lambert);
           }
         });
  };

