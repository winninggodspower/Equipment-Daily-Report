"use server"
import { normalizeToUTC } from "../utils"
import dbConnect from "@/lib/mongoose"
import DailyReport from "@/models/dailyreport"

// Fetch all reports, or filter by date if provided
export async function getReports(filterDate = null) {
  await dbConnect()

  const query = filterDate ? { date: normalizeToUTC(filterDate) } : {}
  // Don't use .lean() so we get the virtual fields
  const reports = await DailyReport.find(query).sort({ date: 1 })

  console.log("Fetched reports:", reports.length, "reports found.")

  // Convert to plain JSON-serializable objects
  const serializedReports = reports.map((report) => ({
    id: report._id.toString().substring(0, 7), // Shorten ID for display
    name: report.name,
    equipmentTag: report.equipmentTag,
    location: report.location,
    startHour: report.startHour,
    startMinute: report.startMinute,
    endHour: report.endHour,
    endMinute: report.endMinute,
    // Use virtual fields for formatted times and duration
    startTimeFormatted: report.startTimeFormatted,
    endTimeFormatted: report.endTimeFormatted,
    workDurationFormatted: report.workDurationFormatted,
    workDurationMinutes: report.workDurationMinutes,
    startingFuelLevel: report.startingFuelLevel,
    endingFuelLevel: report.endingFuelLevel,
    quantityFuelAdded: report.quantityFuelAdded,
    observations: report.observations,
    date: report.date?.toISOString() ?? null,
    createdAt: report.createdAt?.toISOString() ?? null,
    updatedAt: report.updatedAt?.toISOString() ?? null,
  }))

  return serializedReports
}

export async function downloadDailyReport(date) {
  await dbConnect()

  // Don't use .lean() so we get the virtual fields
  const reports = await DailyReport.find({ date: normalizeToUTC(date) }).sort({ date: 1 })

  if (!reports.length) {
    return { success: false, message: "No reports found for this date." }
  }

  // Define CSV headers
  const headers = [
    "Report ID",
    "Operator Name",
    "Report Date",
    "Equipment Tag",
    "Location",
    "Start Time",
    "End Time",
    "Work Duration",
    "Starting Fuel Level(%)",
    "Ending Fuel Level(%)",
    "Quantity of Fuel Added Today(Ltrs)",
    "Observations/Remarks",
    "Timestamp",
  ]

  // Format data for CSV using virtual fields
  const csvRows = reports.map((report) =>
    [
      report._id
        .toString()
        .substring(0, 7), // Shorten ID for display
      report.name,
      report.date ? new Date(report.date).toISOString().split("T")[0] : "", // Format date for CSV
      report.equipmentTag,
      report.location,
      report.startTimeFormatted, // Use virtual field
      report.endTimeFormatted, // Use virtual field
      report.workDurationFormatted, // Use virtual field
      report.startingFuelLevel,
      report.endingFuelLevel,
      report.quantityFuelAdded,
      `"${report.observations ? report.observations.replace(/"/g, '""') : ""}"`, // Escape double quotes, handle undefined
      report.createdAt ? new Date(report.createdAt).toISOString() : "", // Use createdAt for timestamp
    ].join(","),
  )

  const csvContent = [headers.join(","), ...csvRows].join("\n")

  return {
    success: true,
    data: csvContent,
    filename: `daily_report_${date}.csv`,
  }
}

export async function deleteReport(reportId) {
  await dbConnect()
  try {
    // Mongoose delete by _id
    const result = await DailyReport.deleteOne({ _id: reportId })
    if (result.deletedCount === 1) {
      return { success: true, message: `Report ${reportId} deleted successfully.` }
    } else {
      return { success: false, message: `Report ${reportId} not found.` }
    }
  } catch (error) {
    console.error("Error deleting report:", error)
    return { success: false, message: "Failed to delete report due to a server error." }
  }
}
