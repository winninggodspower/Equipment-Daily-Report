"use client"

import { format } from "date-fns"
import { Trash2, Loader2 } from 'lucide-react' // Removed Copy and MoreHorizontal
import { useState, useTransition } from "react"

export default function ReportTable({ reports, onDeleteReport }) { // Removed onCopyReport prop
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

  if (!reports || reports.length === 0) {
    return <div className="text-center py-8 text-slate-500">No reports found. Try adjusting your filters.</div>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b bg-slate-50">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-600 [&:has([role=checkbox])]:pr-0 w-[100px]">
              ID
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-600 [&:has([role=checkbox])]:pr-0">
              Operator
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-600 [&:has([role=checkbox])]:pr-0">
              Date
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-600 [&:has([role=checkbox])]:pr-0">
              Equipment
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-600 [&:has([role=checkbox])]:pr-0">
              Location
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-600 [&:has([role=checkbox])]:pr-0">
              Hours (Start/End)
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-600 [&:has([role=checkbox])]:pr-0">
              Fuel (Start/End)
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-600 [&:has([role=checkbox])]:pr-0">
              Fuel Added (Ltrs)
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-600 [&:has([role=checkbox])]:pr-0">
              Observations
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-slate-600 [&:has([role=checkbox])]:pr-0">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {reports.map((report) => (
            <tr
              key={report.id}
              className="border-b transition-colors hover:bg-slate-50 data-[state=selected]:bg-slate-50"
            >
              <td className="p-4 align-middle font-medium text-slate-700">{report.id}</td>
              <td className="p-4 align-middle">{report.name}</td>
              <td className="p-4 align-middle">{report.date ? format(new Date(report.date), "MMM dd, yyyy") : 'N/A'}</td>
              <td className="p-4 align-middle">{report.equipmentTag}</td>
              <td className="p-4 align-middle">{report.location}</td>
              <td className="p-4 align-middle">{`${report.startingRunningHours} / ${report.endingRunningHours}`}</td>
              <td className="p-4 align-middle">{`${report.startingFuelLevel}% / ${report.endingFuelLevel}%`}</td>
              <td className="p-4 align-middle">{report.quantityFuelAdded}</td>
              <td className="p-4 align-middle max-w-[200px] truncate">{report.observations}</td>
              <td className="p-4 align-middle flex gap-2">
                <button
                  onClick={() => handleDeleteClick(report.id)}
                  disabled={isDeleting && deletingId === report.id}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 bg-red-500 text-white hover:bg-red-600 shadow-sm"
                  title={`Delete report ${report.id}`}
                >
                  {isDeleting && deletingId === report.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
