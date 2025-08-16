"use server"
import { object, string, number, date } from "yup"
import mongoose from "mongoose"
import dbConnect from "./lib/mongoose"
import DailyReport from "./models/dailyreport"
import { normalizeToUTC } from "./utils"

const equipmentSchema = object({
  name: string().trim().required("Operator Name is required"),
  date: date().required("Report Date is required").nullable(), // .nullable() allows empty string/null to be parsed as null date
  equipmentTag: string().trim().required("Equipment Tag is required"),
  location: string().trim().required("Location is required"),
  startHour: number()
    .required("Start Hour is required")
    .min(0, "Start Hour must be between 0-and infinity")
    .integer("Start Hour must be a whole number"),
  startMinute: number()
    .required("Start Minute is required")
    .min(0, "Start Minute must be between 0-59")
    .max(59, "Start Minute must be between 0-59")
    .integer("Start Minute must be a whole number"),
  endHour: number()
    .required("End Hour is required")
    .min(0, "End Hour must be between 0-and infinity")
    .integer("End Hour must be a whole number"),
  endMinute: number()
    .required("End Minute is required")
    .min(0, "End Minute must be between 0-59")
    .max(59, "End Minute must be between 0-59")
    .integer("End Minute must be a whole number")
    .test("end-time-after-start-time", "End time must be after start time", function (endMinute) {
      const { startHour, startMinute, endHour } = this.parent
      const startTimeMinutes = startHour * 60 + startMinute
      const endTimeMinutes = endHour * 60 + endMinute
      return endTimeMinutes > startTimeMinutes
    }),
  startingFuelLevel: number()
    .required("Starting Fuel Level is required")
    .min(0, "Starting Fuel Level cannot be negative")
    .max(100, "Starting Fuel Level cannot exceed 100%"),
  endingFuelLevel: number()
    .required("Ending Fuel Level is required")
    .min(0, "Ending Fuel Level cannot be negative")
    .max(100, "Ending Fuel Level cannot exceed 100%"),
  quantityFuelAdded: number().required("Fuel Added Today is required").min(0, "Fuel Added Today cannot be negative"),
  observations: string().trim().nullable(),
})

export async function submitEquipmentForm(previousState, formData) {
  // Extract form data
  const data = {
    name: formData.get("name"),
    date: normalizeToUTC(formData.get("date")),
    equipmentTag: formData.get("equipmentTag"),
    location: formData.get("location"),
    startHour: Number.parseInt(formData.get("startHour")),
    startMinute: Number.parseInt(formData.get("startMinute")),
    endHour: Number.parseInt(formData.get("endHour")),
    endMinute: Number.parseInt(formData.get("endMinute")),
    startingFuelLevel: Number.parseFloat(formData.get("startingFuelLevel")),
    endingFuelLevel: Number.parseFloat(formData.get("endingFuelLevel")),
    quantityFuelAdded: Number.parseFloat(formData.get("quantityFuelAdded")),
    observations: formData.get("observations"),
  }

  try {
    const validatedData = await equipmentSchema.validate(data, { abortEarly: false })
    console.log("Validation successful:", validatedData)

    // Connect to MongoDB
    await dbConnect()

    console.log("Connected to database:", mongoose.connection.name)

    // Save to database
    const report = new DailyReport(validatedData)
    await report.save()

    return { success: true, message: "Equipment report submitted successfully!" }
  } catch (error) {
    if (error.name === "ValidationError") {
        const errors = Array.isArray(error.inner) && error.inner.length > 0
      ? error.inner.map((err) => err.message)
      : [error.message]
      console.error("Validation errors:", errors)
      return { success: false, errors }
    }
    // Handle other types of errors (e.g., database errors)
    console.error("Server action error:", error)
    return { success: false, errors: ["An unexpected error occurred."] }
  }
}
