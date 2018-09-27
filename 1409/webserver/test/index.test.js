
const { get } = require('axios');
let should = require('should');

const cases = [
		{n1: 7, n2: 8, res: 15},
		{n1: 5, n2: 4, res: 9},
		{n1: 3, n2: 4, res: 7}
];

const headers = { 'Content-Type': 'application/json' };

cases.forEach( ({n1, n2, res}) => {

	const URL = `http://localhost:4321/add/${n1}/${n2}`;

	describe('asyncAdd', () => {
				
			it(`should return ${res} when ${n1} and ${n2} were entered`, async () => {
			
				const { data: {"Сумма": sum} } = await get(URL, {headers});
				sum.should.equal(res); 
			});
	});
});