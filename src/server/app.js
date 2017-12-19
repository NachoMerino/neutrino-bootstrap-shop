const express = require('express');
const fs = require('fs');
const path = require('path');
const Router = express.Router;
const app = express();
const cors = require('cors');
const mysql = require('mysql');

const frontendDirectoryPath = path.resolve(__dirname, './../static');

console.log('static resource at: ' + frontendDirectoryPath);
app.use(express.static(frontendDirectoryPath));
app.use(cors());


var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'online_shop'
});


// always want to have /api in the beginning
const apiRouter = new Router();
app.use('/api', apiRouter);

apiRouter.get('/', (req, res) => {
	res.send({'shop-api': '1.0'});
});

apiRouter.get('/products', (req, res) => {
	con.query('select * from products', function(err, rows) {
		if(err)
			throw res.json( err );

		console.log( rows );
		res.json( rows );
	});
});

apiRouter.get('/categories', (req, res) => {
	con.query('select * from product_categories', function(err, rows) {
		if(err)
			throw res.json( err );

		console.log( rows );
		res.json( rows );
	});
});


app.listen( 9090, (err) => {
	if(err) throw err;
	console.log('Server started on port 9090');
});
