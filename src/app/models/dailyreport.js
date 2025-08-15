import mongoose from "mongoose"

const dailyReportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    equipmentTag: { type: String, required: true },
    location: { type: String, required: true },
    startHour: { type: Number, required: true, min: 0, max: 23 },
    startMinute: { type: Number, required: true, min: 0, max: 59 },
    endHour: { type: Number, required: true, min: 0, max: 23 },
    endMinute: { type: Number, required: true, min: 0, max: 59 },
    startingFuelLevel: { type: Number, required: true, min: 0, max: 100 },
    endingFuelLevel: { type: Number, required: true, min: 0, max: 100 },
    quantityFuelAdded: { type: Number, required: true, min: 0 },
    observations: { type: String },
  },
  { timestamps: true },
) // `timestamps` adds createdAt and updatedAt fields

// Add a virtual field to calculate work duration in minutes
dailyReportSchema.virtual("workDurationMinutes").get(function () {
  const startTimeMinutes = this.startHour * 60 + this.startMinute
  const endTimeMinutes = this.endHour * 60 + this.endMinute
  return endTimeMinutes - startTimeMinutes
})

// Add a virtual field to format work duration as HH:MM
dailyReportSchema.virtual("workDurationFormatted").get(function () {
  const totalMinutes = this.workDurationMinutes
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
})

// Add a virtual field to format start time as HH:MM
dailyReportSchema.virtual("startTimeFormatted").get(function () {
  return `${this.startHour.toString().padStart(2, "0")}:${this.startMinute.toString().padStart(2, "0")}`
})

// Add a virtual field to format end time as HH:MM
dailyReportSchema.virtual("endTimeFormatted").get(function () {
  return `${this.endHour.toString().padStart(2, "0")}:${this.endMinute.toString().padStart(2, "0")}`
})

// Ensure virtual fields are serialized
dailyReportSchema.set("toJSON", { virtuals: true })
dailyReportSchema.set("toObject", { virtuals: true })

const DailyReport = mongoose.models.DailyReport || mongoose.model("DailyReport", dailyReportSchema)

export default DailyReport
