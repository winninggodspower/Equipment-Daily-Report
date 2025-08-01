import { Tag, MapPin, Clock, Fuel, FileText } from "lucide-react"
import { format } from "date-fns"

export default function ReportCards({ reports }) {
  if (!reports || reports.length === 0) {
    return <div className="text-center py-8 text-slate-500">No reports found. Try adjusting your filters.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <div
          key={report.id}
          className="rounded-xl border bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex flex-col space-y-1.5 p-6 pb-3">
            <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-600" />
              {report.equipmentTag}
            </h3>
            <p className="text-sm text-muted-foreground text-slate-500">
              Report ID: {report.id} &bull; {format(new Date(report.date), "MMM dd, yyyy")}
            </p>
          </div>
          <div className="p-6 pt-0 space-y-3 text-sm">
            <div className="flex items-center text-slate-700">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">Location:</span> {report.location}
            </div>
            <div className="flex items-center text-slate-700">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">Hours:</span> {report.startingRunningHours} - {report.endingRunningHours}
            </div>
            <div className="flex items-center text-slate-700">
              <Fuel className="w-4 h-4 mr-2 text-amber-500" />
              <span className="font-medium">Fuel:</span> {report.startingFuelLevel}% - {report.endingFuelLevel}%
            </div>
            {report.quantityFuelAdded > 0 && (
              <div className="flex items-center text-slate-700">
                <Fuel className="w-4 h-4 mr-2 text-amber-500" />
                <span className="font-medium">Added:</span> {report.quantityFuelAdded} Ltrs
              </div>
            )}
            {report.observations && (
              <div className="flex items-start text-slate-700">
                <FileText className="w-4 h-4 mr-2 mt-1 text-purple-500" />
                <span className="font-medium">Remarks:</span>{" "}
                <span className="flex-1 line-clamp-2">{report.observations}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
