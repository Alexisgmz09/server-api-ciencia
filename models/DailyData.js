const  mongoose = require("../server.js").mongoose;

const DailyDataSchema = new mongoose.Schema({
	date: Date,
	IPC: Number,
	oil: Number,
	gold: Number,
	INPC: Number,
	PIB: Number,
	TIIE: Number,
	infl: Number,
	des: Number,
	AC: Number,
	ALFAA: Number,
	ALSEA: Number,
	AMXL: Number,
	BIMBOA: Number,
	FEMSAUBD: Number,
	KOFL: Number,
	'LIVEPOLC-1': Number,
	TLEVISACPO: Number,
	WALMEX: Number,
	USDMXN: Number,
});
const DailyData = mongoose.model('daily_data',DailyDataSchema);

module.exports = {
	DailyData,
}