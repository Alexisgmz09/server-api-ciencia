const  mongoose = require("../server.js").mongoose;

const PredictionsSchema = new mongoose.Schema({
	date: Date,
	company: String,
	prediction: Number,
	day_predicted: Number,
});
const Predictions = mongoose.model('model_prediction',PredictionsSchema);

module.exports = {
	Predictions,
}