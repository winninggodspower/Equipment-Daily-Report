"use client"

import { Tag, MapPin, Clock, Fuel, FileText, Trash2, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useState, useTransition } from "react"

export default function ReportCards({ reports, onDeleteReport }) {
  const [deletingId, setDeletingId] = useState(null)
  const [isDeleting, startDeleteTransition] = useTransition()

  const handleDeleteClick = (reportId) => {
    if (window.confirm(`Are you sure you want to delete report ${reportId}?`)) {
      setDeletingId(reportId)
      startDeleteTransition(async () => {
        await onDeleteReport(reportId)
        setDeletingId(null)
      })
    }
  }

  // Fallback functions for when virtual fields aren't available
  const formatTime = (hours, minutes) => {
    if (hours === undefined || minutes === undefined) return "N/A"
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  const calculateDuration = (startHour, startMinute, endHour, endMinute) => {
    if (startHour === undefined || startMinute === undefined || endHour === undefined || endMinute === undefined) {
      return "N/A"
    }
    const startTimeMinutes = startHour * 60 + startMinute
    const endTimeMinutes = endHour * 60 + endMinute
    const durationMinutes = endTimeMinutes - startTimeMinutes
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    return `${hours}h ${minutes}m`
  }

  if (!reports || reports.length === 0) {
    return <div className="text-center py-8 text-slate-500">No reports found. Try adjusting your filters.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <div
          key={report.id}
          className="rounded-xl border bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-200 relative"
        >
          <div className="flex flex-col space-y-1.5 p-6 pb-3">
            <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-600" />
              {report.equipmentTag}
            </h3>
            <p className="text-sm text-muted-foreground text-slate-500">
              Report ID: {report.id} &bull; {report.date ? format(new Date(report.date), "MMM dd, yyyy") : "N/A"}
            </p>
          </div>
          <div className="p-6 pt-0 space-y-3 text-sm">
            <div className="flex items-center text-slate-700">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">Location:</span> {report.location}
            </div>
            <div className="flex items-center text-slate-700">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">Time:</span>{" "}
              {/* Use virtual fields if available, fallback to manual formatting */}
              {report.startTimeFormatted && report.endTimeFormatted
                ? `${report.startTimeFormatted} - ${report.endTimeFormatted}`
                : `${formatTime(report.startHour, report.startMinute)} - ${formatTime(report.endHour, report.endMinute)}`}
            </div>
            <div className="flex items-center text-slate-700">
              <Clock className="w-4 h-4 mr-2 text-green-500" />
              <span className="font-medium">Duration:</span>{" "}
              {/* Use virtual field if available, fallback to manual calculation */}
              {report.workDurationFormatted ||
                calculateDuration(report.startHour, report.startMinute, report.endHour, report.endMinute)}
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
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => handleDeleteClick(report.id)}
              disabled={isDeleting && deletingId === report.id}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 bg-red-500 text-white hover:bg-red-600 shadow-sm"
              title={`Delete report ${report.id}`}
            >
              {isDeleting && deletingId === report.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="sr-only">Delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
