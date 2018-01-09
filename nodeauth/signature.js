var jwt = require('jsonwebtoken');

const signature = 'mysignature';
const encryptedToken = jwt.sign({ user: 'hallo', pwd: 'world' }, signature);
console.log('encrypted: ' + encryptedToken);

jwt.verify(encryptedToken, signature, function(err, data) {
	if(err) {
		console.log('verification is went wrong.');		
	} else {
		console.log('decrypted token: ' + data);
	}
});