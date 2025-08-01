"use server"
import dbConnect from '@/lib/mongoose';
import DailyReport from '@/models/dailyreport';

// Simulated database of reports
const simulatedReports = [
  {
    id: "rep_001",
    name: "John Doe",
    date: "2025-07-30",
    equipmentTag: "EXC-001",
    location: "Site A",
    startingRunningHours: 100.5,
    endingRunningHours: 108.2,
    startingFuelLevel: 75.0,
    endingFuelLevel: 60.5,
    quantityFuelAdded: 0,
    observations: "Routine operation, no issues.",
    timestamp: new Date("2025-07-30T10:00:00Z").toISOString(),
  },
  {
    id: "rep_002",
    name: "Jane Smith",
    date: "2025-07-30",
    equipmentTag: "TRK-005",
    location: "Site B",
    startingRunningHours: 500.0,
    endingRunningHours: 512.8,
    startingFuelLevel: 40.0,
    endingFuelLevel: 25.0,
    quantityFuelAdded: 50,
    observations: "Fuel added. Engine running smoothly.",
    timestamp: new Date("2025-07-30T11:30:00Z").toISOString(),
  },
  {
    id: "rep_003",
    name: "Alice Johnson",
    date: "2025-07-31",
    equipmentTag: "GEN-003",
    location: "Site C",
    startingRunningHours: 200.0,
    endingRunningHours: 205.0,
    startingFuelLevel: 90.0,
    endingFuelLevel: 85.0,
    quantityFuelAdded: 0,
    observations: "Generator operating within parameters.",
    timestamp: new Date("2025-07-31T09:15:00Z").toISOString(),
  },
  {
    id: "rep_004",
    name: "John Doe",
    date: "2025-07-31",
    equipmentTag: "EXC-001",
    location: "Site A",
    startingRunningHours: 108.2,
    endingRunningHours: 115.0,
    startingFuelLevel: 60.5,
    endingFuelLevel: 45.0,
    quantityFuelAdded: 30,
    observations: "Minor hydraulic leak observed, will monitor.",
    timestamp: new Date("2025-07-31T14:00:00Z").toISOString(),
  },
  {
    id: "rep_005",
    name: "Bob Williams",
    date: "2025-08-01",
    equipmentTag: "TRK-005",
    location: "Site B",
    startingRunningHours: 512.8,
    endingRunningHours: 520.1,
    startingFuelLevel: 25.0,
    endingFuelLevel: 15.0,
    quantityFuelAdded: 0,
    observations: "Tire pressure checked. All good.",
    timestamp: new Date("2025-08-01T08:45:00Z").toISOString(),
  },
]

// Fetch all reports, or filter by date if provided
export async function getReports(filterDate = null) {
  await dbConnect();
  let query = filterDate ? {date: filterDate} : {};
  const reports = await DailyReport.find(query).sort({ date: 1 }).lean();

  return reports;
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
      report.id,
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
