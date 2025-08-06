"use client"

import { useState, useEffect, useTransition } from "react"
import { getReports, downloadDailyReport } from "./actions"
import { List, Grid, Download, Loader2, CalendarDays, CheckCircle, AlertCircle } from "lucide-react"
import ReportTable from "@/components/report-table"
import ReportCards from "@/components/report-cards"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"
import { redirect } from "next/navigation"

export default function AdminPage() {
  const { data: session } = useSession()
  const [isFetching, startFetching] = useTransition()
  const [isDownloading, startDownloading] = useTransition()
  const [reports, setReports] = useState([])
  const [viewMode, setViewMode] = useState("table") // 'table' or 'card'
  const [filterDate, setFilterDate] = useState("") // YYYY-MM-DD format
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string } or null


  
  useEffect(() => {
    startFetching(async () => {
      const fetchedReports = await getReports(filterDate || null)
      setReports(fetchedReports)
    })
  }, [filterDate]) // Refetch when filterDate changes

  const handleDownload = async () => {
    if (!filterDate) {
      setMessage({ type: "error", text: "Please select a date to download the report." });
      return;
    }

    startDownloading(async () => {
      const result = await downloadDailyReport(filterDate)
      if (result.success) {
        const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.setAttribute("download", result.filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setMessage({ type: "success", text: `Daily report for ${filterDate} downloaded successfully.` });
      } else {
        setMessage({ type: "error", text: result.message || "Could not download report." });
      }
      setTimeout(() => setMessage(null), 5000)
    })
  }

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-3">Report Dashboard</h1>
          <p className="text-lg text-slate-600">View and manage all submitted equipment reports.</p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-8 p-4 rounded-r-lg flex items-center ${
              message.type === "success"
                ? "bg-emerald-50 border-l-4 border-emerald-400 text-emerald-700"
                : "bg-red-50 border-l-4 border-red-400 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-3 text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-3 text-red-400" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Date Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label htmlFor="filterDate" className="text-slate-700 flex items-center gap-1 text-sm font-medium">
              <CalendarDays className="w-4 h-4" /> Filter by Date:
            </label>
            <input
              id="filterDate"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="flex h-10 w-full md:w-[180px] rounded-md border border-slate-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 w-full md:w-auto justify-center">
            <button
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
                viewMode === "table"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <List className="w-4 h-4 mr-2" /> Table View
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
                viewMode === "card"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Grid className="w-4 h-4 mr-2" /> Card View
            </button>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading || !filterDate}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white shadow-sm"
          >
            {isDownloading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Download Daily Report
          </button>
        </div>

        {/* Reports Display */}
        {isFetching ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-emerald-500" />
            <span className="ml-3 text-lg text-slate-600">Loading reports...</span>
          </div>
        ) : viewMode === "table" ? (
          <ReportTable reports={reports} />
        ) : (
          <ReportCards reports={reports} />
        )}
      </div>
    </div>
  )
}
