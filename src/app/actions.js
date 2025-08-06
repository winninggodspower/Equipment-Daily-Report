"use server"
import { object, string, number, date } from 'yup';
import mongoose from 'mongoose';
import dbConnect from './lib/mongoose';
import DailyReport from './models/dailyreport';
import { normalizeToUTC } from './utils';


let equipmentSchema = object({
  name: string().trim().required('Operator Name is required'),
  date: date().required('Report Date is required').nullable(), // .nullable() allows empty string/null to be parsed as null date
  equipmentTag: string().trim().required('Equipment Tag is required'),
  location: string().trim().required('Location is required'),
  startingRunningHours: number()
    .required('Starting Hours is required')
    .min(0, 'Starting Hours cannot be negative'),
  endingRunningHours: number()
    .required('Ending Hours is required')
    .min(0, 'Ending Hours cannot be negative')
    .test(
      'ending-greater-than-starting',
      'Ending hours cannot be less than starting hours',
      function (endingHours) {
        const { startingRunningHours } = this.parent;
        return endingHours >= startingRunningHours;
      }
    ),
  startingFuelLevel: number()
    .required('Starting Fuel Level is required')
    .min(0, 'Starting Fuel Level cannot be negative')
    .max(100, 'Starting Fuel Level cannot exceed 100%'),
  quantityFuelAdded: number()
    .required('Fuel Added Today is required')
    .min(0, 'Fuel Added Today cannot be negative'),
  observations: string().trim().nullable(),
});

export async function submitEquipmentForm(previousState, formData) {

  // Extract form data
  const data = {
    name: formData.get("name"),
    date: normalizeToUTC(formData.get("date")),
    equipmentTag: formData.get("equipmentTag"),
    location: formData.get("location"),
    startingRunningHours: Number.parseFloat(formData.get("startingRunningHours")),
    endingRunningHours: Number.parseFloat(formData.get("endingRunningHours")),
    startingFuelLevel: Number.parseFloat(formData.get("startingFuelLevel")),
    endingFuelLevel: Number.parseFloat(formData.get("endingFuelLevel")),
    quantityFuelAdded: Number.parseFloat(formData.get("quantityFuelAdded")),
    observations: formData.get("observations"),
  }

  try {
    let validatedData = await equipmentSchema.validate(data, {abortEarly: false})
    console.log("Validation successful:", validatedData);

    // Connect to MongoDB
    await dbConnect();

    console.log("Connected to database:", mongoose.connection.name);

    // Save to database
    const report = new DailyReport(validatedData);
    await report.save();

    return { success: true, message: "Equipment report submitted successfully!" };

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = error.inner.map(err => err.message);
      console.error("Validation errors:", errors);
      return { success: false, errors };
    }
    // Handle other types of errors (e.g., database errors)
    console.error("Server action error:", error);
    return { success: false, errors: ["An unexpected error occurred."] };
  }
}
