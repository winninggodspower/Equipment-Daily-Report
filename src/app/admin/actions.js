"use server"
import { normalizeToUTC } from '../utils';
import dbConnect from '@/lib/mongoose';
import DailyReport from '@/models/dailyreport';


// Fetch all reports, or filter by date if provided
export async function getReports(filterDate = null) {
  await dbConnect();

  let query = filterDate ? { date: normalizeToUTC(filterDate)} : {};
  const reports = await DailyReport.find(query).sort({ date: 1 }).lean();

  console.log("Fetched reports:", reports.length, "reports found.");

  // Convert to plain JSON-serializable objects
  const serializedReports = reports.map((report) => ({
    id: report._id.toString().substring(0, 7), // Shorten ID for display
    name: report.name,
    equipmentTag: report.equipmentTag,
    location: report.location,
    startingRunningHours: report.startingRunningHours,
    endingRunningHours: report.endingRunningHours,
    startingFuelLevel: report.startingFuelLevel,
    endingFuelLevel: report.endingFuelLevel,
    quantityFuelAdded: report.quantityFuelAdded,
    observations: report.observations,
    date: report.date?.toISOString() ?? null,
    createdAt: report.createdAt?.toISOString() ?? null,
    updatedAt: report.updatedAt?.toISOString() ?? null,
  }));

  return serializedReports;
}

export async function downloadDailyReport(date) {
  await dbConnect();
  let query = filterDate ? {date: filterDate} : {};

  const reports = await DailyReport.find(query).sort({ date: 1 }).lean();

  if (!reports.length) {
    return { success: false, message: "No reports found for this date." };
  }


  // Define CSV headers
  const headers = [
    "Report ID",
    "Operator Name",
    "Report Date",
    "Equipment Tag",
    "Location",
    "Starting Running Hours",
    "Ending Running Hours",
    "Starting Fuel Level(%)",
    "Ending Fuel Level(%)",
    "Quantity of Fuel Added Today(Ltrs)",
    "Observations/Remarks",
    "Timestamp",
  ]

  // Format data for CSV
  const csvRows = reportsForDate.map((report) =>
    [
      report._id.toString().substring(0, 7), // Shorten ID for display
      report.name,
      report.date,
      report.equipmentTag,
      report.location,
      report.startingRunningHours,
      report.endingRunningHours,
      report.startingFuelLevel,
      report.endingFuelLevel,
      report.quantityFuelAdded,
      `"${report.observations.replace(/"/g, '""')}"`, // Escape double quotes
      report.timestamp,
    ].join(","),
  )

  const csvContent = [headers.join(","), ...csvRows].join("\n")

  return {
    success: true,
    data: csvContent,
    filename: `daily_report_${date}.csv`,
  }
}
