const { get } = require('axios');
const should = require('should');

const cases = [
	{a: 2, res: 2},
	{a: 3, res: 3},
	{a: 8, res: 8}
];



const headers = { 'Content-Type': 'application/json'};


cases.forEach( ({a,res}) =>{
	const URL = `https://kodaktor.ru/api2/there/${a}`
	describe('asyncFunc', () => {
		it( `Посылаемое значение ${a} эквивалентно полученному обратно ${res} `, async () => {
			const { data: ax } = await get(URL, {headers});
			const { data: back} = await get(  `https://kodaktor.ru/api2/andba/${ax}`, {headers});
			back.should.equal(res);
		});
	});

});