import polka from 'polka';


function one (req, res, next) {
	req.one = true;
	return next();
}

function two (req, res, next) {
	req.two = true;
	return next();
}

polka()
	.use('/', one, two)
	.get('/favicon.ico', () => {})
	.get('/', (req, res) => { res.end('Hello') })
	.get('/user/:id', (req, res) => { res.end(`User: ${req.params.id}`) })
	.listen(3030);
