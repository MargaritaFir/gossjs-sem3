const Timer = require('timerpromise');

(async () => {
	console.time('s0');
	console.time('s1');

	await new Timer(3).start;
	console.timeEnd('s1');
	console.time('s2');
	await new Timer(2).start;
	console.timeEnd('s2');
	console.timeEnd('s0');
})();