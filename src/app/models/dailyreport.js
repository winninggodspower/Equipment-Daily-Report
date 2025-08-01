import mongoose from 'mongoose';

const dailyReportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  equipmentTag: { type: String, required: true },
  location: { type: String, required: true },
  startingRunningHours: { type: Number, required: true },
  endingRunningHours: { type: Number, required: true },
  startingFuelLevel: { type: Number, required: true },
  endingFuelLevel: { type: Number, required: true },
  quantityFuelAdded: { type: Number, required: true },
  observations: { type: String },
}, { timestamps: true }); // `timestamps` adds createdAt and updatedAt fields

const DailyReport =  mongoose.models.DailyReport || mongoose.model('DailyReport', dailyReportSchema);

export default DailyReport;