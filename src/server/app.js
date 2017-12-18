const express = require('express');
const fs = require('fs');
const path = require('path');
const Router = express.Router;
const app = express();

const frontendDirectoryPath = path.resolve(__dirname, './../static');

console.log('static resource at: ' + frontendDirectoryPath);

app.use(express.static(frontendDirectoryPath));

// always want to have /api in the beginning
const apiRouter = new Router();
app.use('/api', apiRouter);

apiRouter.get('/', (req, res) => {
	res.send({'shop-api': '1.0'});
});

apiRouter.get('/products', (req, res) => {
	fs.readFile(frontendDirectoryPath + '/products.json', 
		(err, content) => {
			if(err) throw err;

			res.type('json');
			res.send(content);
		});
});

apiRouter.get('/categories', (req, res) => {
	fs.readFile(frontendDirectoryPath + '/categories.json', 
		(err, content) => {
			if(err) throw err;

			res.type('json');
			res.send(content);
		});
});


app.listen( 9090, (err) => {
	if(err) throw err;
	console.log('Server started on port 9090');
});
