const express = require('express');

const {get} = require('axios');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const Parser = require('rss-parser');
const parser = new Parser();
const zlib = require('zlib');
const trans = require('./trans');
const http = require('http');
let PID;


const PORT = 5000;

const app = express();


app
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({extended:true}))
	//.use((r, res, next) => console.log(r.url)||next()) //logger here
	.use(morgan('tiny'))

  .get('/', r => {
		r.res.sendFile(path.join(__dirname +'/index.html'))
	})

	.post('/name', (req, res)=> {

		res.setHeader('Content-Type', 'application/json; charset=utf-8');
			
		res.end( JSON.stringify({"name": req.body.name}) + "\n");
	})



	/*ADD*/

	.get('/add/:n1/:n2', (req, res) => {

		res
		.set('Content-Type', 'text/html; charset=utf-8')
		.send(`<h3> Сумма: ${+req.params.n1 + +req.params.n2} </h3>`)
	})

	/*SUBTRACT*/

	.get('/subtract/:n1/:n2', (req, res) => {
		res
		.set('Content-Type', 'text/html; charset=utf-8')
		.send(`<h3> Вычитание: ${+req.params.n1 - +req.params.n2} </h3>`)

	})

	/*Multiply*/

	.get('/multiply/:n1/:n2', (req, res) => {
		res
		.set('Content-Type', 'text/html; charset=utf-8')
		.send(`<h3> Умножение: ${+req.params.n1 * +req.params.n2} </h3>`)
	})

	/*DIVIDE*/

	.get('/divide/:n1/:n2', (req, res) => {
		res
		.set('Content-Type', 'text/html; charset=utf-8')
		.send(`<h3> Деление: ${+req.params.n1 / +req.params.n2} </h3>`)
	})

	/*POW(N1,N2)*/

	.get('/pow/:n1/:n2', (req, res) => {
		res
		.set('Content-Type', 'text/html; charset=utf-8')
		.send(`<h3> Возведение в степень: ${Math.pow(+req.params.n1,req.params.n2)} </h3>`)
	})

	/*==KRAMER===*/

	.get('/kramer/:a1/:b1/:c1/:a2/:b2/:c2', (req, res) => {
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
	
	res
	.set('Content-Type', 'text/html; charset=utf-8')
	.send(`<h3> Ответ с kodaktor.ru: ${back}, промежуточное число: ${ax} </h3>`)
	})


 /*===== NODE-002 (Погода) =====*/

  .get('/weather', async(req, res) => {
    const URL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20woeid%3D%222123260%22)%20and%20u%3D'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    const { data : { query : { results : { channel : { item : { forecast : [ , el1 ] }}}}}} = await get(URL, {'Content-Type' : 'application/json'});
    res
      .set({'Content-Type' : 'text/html; charset=utf-8'})
      .send(`<h4>Дата : ${el1.date}</h4>
        <h3>Самая высокая температура: ${el1.high}&deg;</h3>
        <h3>Самая низкая температура: ${el1.low}&deg;</h3>`)
  })




/*===== NODE-003 (RSS) =====*/

.get('/node_rss/:n', async (req, res) => {
    let n = +req.params.n;
    let result= '';
    const { items } = await parser.parseURL('https://nodejs.org/en/feed/blog.xml');
    items
      .map(({ title, link }) => ({ title, link }))
      .slice(0, n)
      .forEach(({ title, link }) => {
        result += `<h4><a href=${link} target=_blank>${title}</a></h4>`;
    });
    res.send(result);
  })

   /*===== GZIP-0001 =====*/

  .get('/zip', (req, res) => {
    res.sendFile(path.join(__dirname+'/zip.html'));
  })
  .post('/zip', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename=result.zip',});
    req
      .pipe(trans)
      .pipe(zlib.createGzip())
      .pipe(res);
  })

  /*===== NODE-004 =====*/

  .get('/buffer', (req, res) => {
    const URL = 'http://kodaktor.ru/api2/buffer2';
    const num = 333;
    const reg = /\w{4}/g;
    let word = '';
    const numsArr = [...Array.from(Array(2).keys(), x => x + num)];
    const length = numsArr.length;
    const resArr = [];
    numsArr.forEach(number => {

      http.get(`${URL}/${number}`, response => {
        let data = '';
        response.on('data', chunk => {
          const found = String(chunk).match(reg);
          if (found && !word) {
            let [foundWord] = found;
            word = foundWord;
          }
          data += chunk;
        });
        response.on('end', () => {
          resArr.push({
            number: number,
            size: data.length,
          });

          if(resArr.length === length) {
            let result = resArr.map((item) => {
              return `Number: ${item.number}, Size (V2): ${item.size} <br>`;
            })
            res.send(`Secret word: <strong>${word}</strong> <br> ${result}`);
          } 
        });
      });
    });
  })

  //second App
  .get('/other_process', (req, res) => {
    const port = process.env.PORT || 3331;
    const secondApp = express();
    newServer = secondApp.listen(port, () => {
      console.log(`New server is listening on ${port}`);
    });
    
    res.send(`PID: ${PID}, PPID: ${process.pid}`);
  })

// MW Static

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