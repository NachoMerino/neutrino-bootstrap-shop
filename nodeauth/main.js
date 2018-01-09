var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const app = express();
app.use(bodyParser());

const users = [
	{ email: 'user1@gmail.com', password: 'hallo1' },
	{ email: 'user2@gmail.com', password: 'hallo2' },
	{ email: 'user3@gmail.com', password: 'hallo3' }
];

const serverSignature = 'secret_server_signature';

app.get('/public', function(req, res) {
	res.json({
		text: 'this is public'
	})
});

function ensureToken(req, res, next) {
	console.log('arrived at middleware ensureToken for /protected');
	const bearerHeader = req.headers['authorization'];
	if(typeof bearerHeader !== "undefined") {
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}

function isAuthorized(req, res, next) {
	jwt.verify(req.token, serverSignature, function(err, data) {
		if(err)
			res.send(403);
		else {
			next();
		}
	});
}

app.get('/protected', ensureToken, isAuthorized, function(req, res) {
	console.log('arrived at /protected');
	res.json({
		text: 'this is protected'
	})
});

app.post('/login', function(req, res) {

	if(!req.body.email || !req.body.password)
		return res.json({ err: 'username and password required'});

	for(let i=0;i<users.length;i++) {
		if(users[i].email === req.body.email && users[i].password === req.body.password) {
				
			const token = jwt.sign(users[i], serverSignature);
			return res.json({
				token: token
			});
		}
	}

	return res.json({ err: 'User/Password not found' });
});

app.listen(3000, function() {
	console.log('app listening on port 3000');
});