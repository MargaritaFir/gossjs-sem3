const { get } = require('axios');
const should = require('should');


const cases = [
	{a: 3, b: 4, res: 7},
	{a: 5, b: 6, res: 11},
	{a: 4, b: 8, res: 12},
	{a: 3, b: 10, res: 13}

]

const headers = {'Content-Type': 'application/json'};


cases.forEach(({a, b, res}) =>{

	const URL = `https://kodaktor.ru/api/add/${a}/${b}`;

	describe('asyncAdd', () => {
		it(`should return ${res} when ${a} and ${b} were entered`, async () => {
			const {data: {"Сумма":result}} = await get(URL, {headers});
			result.should.equal(res);
		});
	});

});
