let fs = require('fs');

const readGold = () => {
	let data = require('./Oro.json');
	data =  data.dataset.data.reverse();
	const d2005 = new Date('2005-04-01');
	let dates = [];
	let values = [];
	for(let i = 0; i < data.length; i++) {
		const currentData = data[i];
		const date = new Date(currentData[0]);
		if (date >= d2005) {
			const value = Number(currentData[1]);
			dates.push(date);
			values.push(value);
		}
	}
	return ({
		gold_dates:dates,
		gold_values: values,
	})
}

const readOil = () => {
	let data = require('./Petroleo.json');
	data =  data.dataset.data.reverse();
	const d2005 = new Date('2005-04-01');
	let dates = [];
	let values = [];
	for(let i = 0; i < data.length; i++) {
		const currentData = data[i];
		const date = new Date(currentData[0]);
		if (date >= d2005) {
			const value = Number(currentData[1]);
			dates.push(date);
			values.push(value);
		}
	}
	return ({
		oil_dates: dates,
		oil_values: values,
	})
}

const readPIB = () => {
	const data = require('./PIB.json');
	let dates = []
	let values = []

	data.forEach(d =>{
		let newdata = generateDatesTrimestral(d)
		const d2005 = new Date('2005-04-01');
		for(let i = 0; i < newdata.dates.length ; i++){
			const date = newdata.dates[i];
				if(date >= d2005){
					dates.push(date);
					values.push(newdata.values[i]);
				}
		}
	});

	return({
		PIB_dates: dates,
		PIB_values: values,
	})
}
const readTIIE = () => {
	const data = require('./TIIE.json');
	let dates = []
	let values = []
	let isFirst = true;
	for (let i = 0; i < data.length; i++) {
		const current = data[i];
		const dateArr = current.fecha.split('/')
		const date = new Date(`20${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`)
		const d2005 = new Date('2005-04-01');
		if (date >= d2005) {
			dates.push(date)
			values.push(current.valor)
		}
	}
	return({
		TIIE_dates: dates,
		TIIE_values: values,
	})
}
const readInfl = () =>{
	const data = require('./Inflacion.json');
	let dates = []
	let values = []
	data.forEach(d =>{
		let newdata = generateDatesMensual(d)
		const d2005 = new Date('2005-04-01');
		for(let i = 0; i < newdata.dates.length ; i++){
			const date = newdata.dates[i];
				if(date >= d2005){
					dates.push(date);
					values.push(newdata.values[i]);
				}
		}
	});
	return({
		infl_dates: dates,
		infl_values: values,
	})
}
const readDes = () =>{
	const data = require('./Desocupacion.json');
	let dates = []
	let values = []
	data.forEach(d =>{
		let newdata = generateDatesMensual(d)
		const d2005 = new Date('2005-04-01');
		for(let i = 0; i < newdata.dates.length ; i++) {
			const date = newdata.dates[i];
			if(date >= d2005) {
				dates.push(date);
				values.push(newdata.values[i]);
			}
		}
	});
	return({
		des_dates: dates,
		des_values: values,
	})
}
const readINPC = () =>{
	let data = require('./INPC.json');
	let dates = [];
	let values = [];
	data.forEach(d =>{
		let newdata = generateDatesQuincenal(d)
		const d2005 = new Date('2005-04-01');
		for(let i = 0; i < newdata.dates.length ; i++){
			const date = newdata.dates[i];
				if(date >= d2005){
					dates.push(date);
					values.push(newdata.values[i]);
				}
		}
	})
	return({
		INPC_dates: dates,
		INPC_values: values,
	})
}
const readIPC = () =>{
	let data = require('./IPC.json');
	let keys = Object.keys(data['Close']);
	const d2005 = new Date('2005-04-01');
	keys = keys.filter(d => new Date(Number(d)) >=d2005);
	const dates= [];
	const values = [];
	for(let i = 0; i < keys.length; i++){
		const unix = keys[i];
		dates.push(new Date(Number(unix)).toISOString());
		const open = Number(data['Open'][unix]);
		const close = Number(data['Close'][unix]);
		values.push(close);
	}
	return({
		IPC_dates:dates,
		IPC_values:values,
	})
}
const readCompany = (comp) =>{
	let data = require(`./${comp}.json`)
	let keys = Object.keys(data['Open']);
	const d2005 = new Date('2005-04-01');
	keys = keys.filter(d => new Date(Number(d)) >=d2005);
	const dates= [];
	const values = [];
	for(let i = 0; i < keys.length; i++){
		const unix = keys[i];
		dates.push(new Date(Number(unix)));
		const close = Number(data['Close'][unix]);
		values.push(close);
	}
	const obj = {}
	obj[`${comp}_dates`] = dates
	obj[`${comp}_values`] = values
	return obj
}

const generateDatesQuincenal = (d) =>{
	const datesArr = d.fecha.split('/')
	const year = Number(('20'+datesArr[2]))
	let dates=[]
	let values = []
	const m = Number(datesArr[0])-1
	const days = getDaysofMonth(year,m)
	if(datesArr[1]==='01'){
		for(let i = 0; i< 15; i++){
			dates.push(new Date(Date.UTC(year,m,i+1)))
			values.push(d.valor)
		}
	}else{
		for(let i = 15; i< days; i++){
			dates.push(new Date(Date.UTC(year,m,i+1)))
			values.push(d.valor)
		}
	}
	return ({
		dates,
		values
	})
}

const generateDatesMensual = (d) =>{
	const datesArr = d.fecha.split('/')
	const year = Number(datesArr[0])
	let dates=[]
	let values = []
	const m = Number(datesArr[1])-1
	const days = getDaysofMonth(year,m)
	for(let i =0; i< days; i++){
		dates.push(new Date(Date.UTC(year,m,i+1)))
		values.push(d.valor)
	}
	return ({
		dates,
		values
	})
}

const generateDatesTrimestral = (d) =>{
	const datesArr = d.fecha.split('/');
	const year = Number(datesArr[0])
	let months = [];
	switch(datesArr[1]){
		case '01':
			months = [0,1,2]
			break
		case '02':
			months = [3,4,5]
			break
		case '03':
			months =[6,7,8]
			break
		case '04':
			months = [9,10,11]
			break
	}
	let dates=[];
	let values = [];
	months.forEach((m) =>{
		const days = getDaysofMonth(year,m);
		for(let i =0; i< days; i++){
			dates.push(new Date(Date.UTC(year,m,i+1)));
			values.push(d.valor)
		}
	})
	return ({
		dates,
		values
	})
}

const getDaysofMonth = (year,month) => new Date(year,month+1,0).getDate();

const getData = () => {
	const companies = ['USDMXN','AC','ALFAA','ALSEA','AMXL','BIMBOA','FEMSAUBD',
	'KOFL','LIVEPOLC-1','TLEVISACPO','WALMEX']
	const gold = readGold()
	const oil = readOil()
	const pib = readPIB()
	const ipc = readIPC()
	const tiie = readTIIE()
	const infl = readInfl()
	const des = readDes()
	const inpc = readINPC()
	const comp = companies.map(c=>readCompany(c))
	const completeData = Object.assign({}, gold,oil,pib,tiie,infl,des,inpc,...comp,ipc)
	fs.writeFile('final.json',JSON.stringify(completeData), (err) => {if(err)throw err})
}

getData()
