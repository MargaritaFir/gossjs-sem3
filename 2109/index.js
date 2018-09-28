const express = require('express');

const {get} = require('axios');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path')


const PORT = 8888;

const app = express();

let frequency = [];

app
.use(bodyParser.json())
.use(bodyParser.urlencoded({extended:true}))
//.use((r, res, next) => console.log(r.url)||next()) //logger here
.use(morgan('tiny'))
.post('/name', (req, res)=> {
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
		
	res.end( JSON.stringify({"name": req.body.name}) + "\n");
})

.get('/', r => r.res.sendFile(path.join(__dirname +'/index.html')))

/*ADD*/

.get('/add/:n1/:n2', (req, res) => {
	frequency.push('add');
	res
	.set('Content-Type', 'text/html; charset=utf-8')
	.send(`<h3> Сумма: ${+req.params.n1 + +req.params.n2} </h3>`)
})

/*SUBTRACT*/

.get('/subtract/:n1/:n2', (req, res) => {
	frequency.push('subtract');
	res
	.set('Content-Type', 'text/html; charset=utf-8')
	.send(`<h3> Вычитание: ${+req.params.n1 - +req.params.n2} </h3>`)

})

   /*Multiply*/

.get('/multiply/:n1/:n2', (req, res) => {
	frequency.push('multiply');
	res
	.set('Content-Type', 'text/html; charset=utf-8')
	.send(`<h3> Умножение: ${+req.params.n1 * +req.params.n2} </h3>`)
})

  /*DIVIDE*/

.get('/divide/:n1/:n2', (req, res) => {
	frequency.push('divide');
	res
	.set('Content-Type', 'text/html; charset=utf-8')
	.send(`<h3> Деление: ${+req.params.n1 / +req.params.n2} </h3>`)
})

  /*POW(N1,N2)*/

.get('/pow/:n1/:n2', (req, res) => {
	frequency.push('pow');
	res
	.set('Content-Type', 'text/html; charset=utf-8')
	.send(`<h3> Возведение в степень: ${Math.pow(+req.params.n1,req.params.n2)} </h3>`)
})

   /*==KRAMER===*/

   .get('/kramer/:a1/:b1/:c1/:a2/:b2/:c2', (req, res) => {
	frequency.push('kramer');
	let det = (+req.params.a1* +req.params.b2) - (+req.params.a2* +req.params.b1);
	let det1 = (+req.params.c1* +req.params.c2) - (+req.params.a2* +req.params.b1);
	let det2 = (+req.params.a1* +req.params.c2) - (+req.params.a2* +req.params.c1);


	res
	.set('Content-Type', 'text/html; charset=utf-8')
	.send((det !=0) ? JSON.stringify({"x": det1/det, "y": det2/det}): {"Error! Det = " : det})
})


   /*Kodaktor*/
   .get('/send_number/:n', async(req,res) => {

   	const URL = `https://kodaktor.ru/api2/there/${+req.params.n}`
	
			const { data: ax } = await get(URL, {'Content-Type': 'application/json'});
			const { data: back} = await get(  `https://kodaktor.ru/api2/andba/${ax}`, {'Content-Type': 'application/json'});
			frequency.push('send_number');
	res
	.set('Content-Type', 'text/html; charset=utf-8')
	.send(`<h3> Ответ с kodaktor.ru: ${back}, промежуточное число: ${ax} </h3>`)
	})


   /*ПОГОДА*/


.get('/weather', async(req, res) => {
	const URL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20woeid%3D%222123260%22)%20and%20u%3D'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	const {data: { query: { results: { channel: { item: { forecast: [ , el1]}}}}}} = await get(URL, 'Content-Type', 'application/json; charset=utf-8');
	frequency.push('weather');
	res
	.set('Content-Type', 'text/html; charset=utf-8')
	.send(`<h3> Cамая низкая температура завтра: ${el1.low} &deg; </h3>`);
})


  /*Подсчёт частоты посещений*/
.use('/freq', (req,res) => {
	let result = frequency.reduce((obj, el) => {
		obj[el] = (obj[el] || 0) +1;
		return obj;
	}, {});
	res
	.set('Content-Type', 'application/json; charset=utf-8')
	.send( JSON.stringify(result));

})

/*=== MW Static ===*/

.use( '/static', express.static('pablic'))


.use(r => r
		.res
		.set({'Content-Type': 'text/html; charset=utf-8'})
		.status(404)
		.end('<b style = "color:red"> к сожалению нету</b>'))

	.use((e,r,res,n) => res
		.set({'Content-Type': 'text/html; charset=utf-8'})
		.status(500)
		.end('<b style = "color:orange"> этого не было</b>'))
	.listen(process.env.PORT||PORT, () => console.log('I OK!'));