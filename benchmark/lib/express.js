import express from 'express';


function one (req, res, next) {
	req.one = true;
	return next();
}

function two (req, res, next) {
	req.two = true;
	return next();
}

express()
	.use(one, two)
	.get('/favicon.ico', () => {})
	.get('/', (req, res) => { res.send('Hello') })
	.get('/user/:id', (req, res) => { res.send(`User: ${req.params.id}`) })
	.listen(3030);
