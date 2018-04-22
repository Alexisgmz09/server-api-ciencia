const genDateArr = (startDate) => {
	const arr = [];
	const stopDate = new Date();
	let currentDate = new Date(startDate);
	while(currentDate<=stopDate){
		arr.push(currentDate);
		currentDate = currentDate.addDays(1);
	}
	return arr;
}
Date.prototype.addDays = function(days) {
	var date = new Date(this.valueOf());
	date.setUTCDate(date.getUTCDate() + days);
	return date;
}
console.log(genDateArr("2005-04-01").length);

/*
const promises = [];
	const data = require('./JSONS/final.json');
	const keys = ['IPC','oil','gold','INPC','PIB','TIIE','infl','des','AC','ALFAA','ALSEA',
	'AMXL','BIMBOA','FEMSAUBD','KOFL','LIVEPOLC-1','TLEVISACPO','WALMEX','USDMXN']
	const dates = genDateArr("2018-04-01");
	dates.forEach(d =>{
		const values = {};
		values.date = d;
		keys.forEach(k => {
			let newDates = data[`${k}_dates`].map(od => {
				const nd = new Date(od);
				const date = new Date(Date.UTC(nd.getUTCFullYear(),nd.getUTCMonth(),nd.getUTCDate(),0,0,0))
				return date;
			});
			newDates = newDates.map(nd => nd.toISOString());
			const index = newDates.indexOf(d.toISOString());
			if(index!==-1){
				values[k]=data[`${k}_values`][index];
			}else{
				values[k]=null;
			}
		});
		//const daily = new DailyData(values);
		promises.push(values);
	});
	console.log(promises);*/