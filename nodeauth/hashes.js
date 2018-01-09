var bcrypt = require('bcrypt');

bcrypt.hash('mysecretpassword', 0, function(err, hash) {
	console.log('hash: ' + hash);

	bcrypt.compare('mysecretpassword', hash, function(err, res) {
		if(res) {
			console.log('passwords match');
		}
		else {
			console.log('passwords do not match');
		}
	});

});