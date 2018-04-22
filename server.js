const express = require("express");
const app = express();
const mongoose	= require("mongoose");
mongoose.Promise = global.Promise;
const morgan = require('morgan');

let port = process.env.PORT || 3500;

app.use(morgan("dev"));

mongoose.connect('mongodb://api:apipass@ds147659.mlab.com:47659/finance-bitsplease');

module.exports = {
	mongoose,
};
let server = app.listen(port,() => console.log('Server started on port: ',port))
server.timeout = 2000;

const { DailyData } = require('./models/DailyData.js');
const { Predictions } = require ('./models/Predictions.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/test',(req,res)=>{
	DailyData.where('TIIE').ne(null).sort({date:-1}).limit(1).then(data =>{
		res.json(data);
	});
});
app.get('/api/update',(req,res)=>{
	const companies = ['AC','ALFAA','ALSEA',
	'AMXL','BIMBOA','FEMSAUBD','KOFL','LIVEPOLC-1','TLEVISACPO','WALMEX'];
});
app.get('/api/fill2',(req,res) => {
	const keys = ['IPC','oil','gold','INPC','PIB','TIIE','infl','des','AC','ALFAA','ALSEA',
'AMXL','BIMBOA','FEMSAUBD','KOFL','LIVEPOLC-1','TLEVISACPO','WALMEX','USDMXN']
	DailyData.find().sort({date:1}).then(data =>{ 
		data.forEach((d,i,arr)=>{
			keys.forEach(k=>{
				d[k] = d[k]===null?arr[i-1][k]:d[k];
			});
			console.log(d._id);
			DailyData.updateOne({_id:d['_id']},d).then(()=>{}).catch(err=>console.log(err));
		})
		res.json("todocool");
	}).catch(err=>res.json(err));
});
app.get('/api/fill',(req,res) => {
	const promises = [];
	const data = require('./JSONS/final.json');
	const keys = ['IPC','oil','gold','INPC','PIB','TIIE','infl','des','AC','ALFAA','ALSEA',
	'AMXL','BIMBOA','FEMSAUBD','KOFL','LIVEPOLC-1','TLEVISACPO','WALMEX','USDMXN']
	const dates = genDateArr("2005-04-01");
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
		const daily = new DailyData(values);
		promises.push(daily.save());
	});
	Promise.all(promises).then(()=>res.json("exito")).catch(err => res.json(err));
});
app.get('/api/getIndex',(req,res) => {
	const keys = ['IPC','oil','gold','INPC','PIB','TIIE','infl','des','AC','ALFAA','ALSEA',
	'AMXL','BIMBOA','FEMSAUBD','KOFL','LIVEPOLC-1','TLEVISACPO','WALMEX','USDMXN']
	let {time, index} = req.query;
	if(!time){
		time = 'one-year';
	}
	if(!keys.includes(index)){
		index = 'IPC';
	}

	const now = new Date();
	let date;
	switch(time){
		case 'one-year':
			date=365;
			//date = new Date(Date.UTC(now.getUTCFullYear()-1,now.getUTCMonth(),now.getUTCDate(),0,0,0));
		break;
		case 'six-months':
			date = 183;
			//date = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-6,now.getUTCDate(),0,0,0));
		break;
		case 'one-month':
			date = 30;
			//date = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-1,now.getUTCDate(),0,0,0));
		break;
		case 'one-week':
		default:
			date = 8;
			//date = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()-7,0,0,0));
		break;
	}
	DailyData.where(index).ne(null).sort({date:-1}).limit(date).then(data => {
		res.json(data.map(d =>{ 
			if(d[index]!==null)
			return [d.date,d[index]]
		}).filter(d=> d!==undefined).reverse());
	}).catch(err => res.json(err));
});
app.get('/api/predictions',(req,res)=>{
	let { index } = req.query;
	const keys = ['IPC','oil','gold','INPC','PIB','TIIE','infl','des','AC','ALFAA','ALSEA',
	'AMXL','BIMBOA','FEMSAUBD','KOFL','LIVEPOLC-1','TLEVISACPO','WALMEX','USDMXN']
	if(!keys.includes(index)){
		index = 'IPC';
	}
	Predictions.find({company: index}).sort({date:-1}).limit(4).then(d=> {
		const r= {};
		r.company= index;
		d.forEach(p => {
			r[`pred_${p.day_predicted}`]=p.prediction;
		});
		res.json(r);
	}).catch(err=>res.json(err));
});
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