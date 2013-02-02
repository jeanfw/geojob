var locomotive = require('locomotive'),
 		env = process.env.NODE_ENV || 'development',
		port = process.env.PORT || 3000,
		address = 'localhost';

locomotive.boot(__dirname, env, function(err, express) {
	if (err) { throw err; }

	express.listen(port, address, function() {
	  var addr = this.address();
	  console.log('Locomotive listening on %s:%d', addr.address, addr.port);
  });	  

});
