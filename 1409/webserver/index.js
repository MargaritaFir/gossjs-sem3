const http = require('http');
const moment = require('moment');
const router =require('http-router');


const server =http.createServer();
server.listen(4321);

const routes = router.createRouter();

routes
.get('/', (req, res) =>{
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	res.end(JSON.stringify({ date: moment().format('DD.MM.YYYY HH:mm:ss') }));
})
.get('/add/:n1/:n2', (req, res) => {
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	let n1 = +req.params.n1;
	let n2 = +req.params.n2;
	res.end(JSON.stringify({"Сумма": n1+n2} ));
});

server.on('request', (req, res) => {
	
	if(!routes.route(req, res)) {
	res.writeHead(501);
	res.end(http.STATUS_CODES[501] + '\n');
	}
});