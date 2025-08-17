"use client"

import { useState, useEffect, useTransition } from "react"
import { getReports, downloadDailyReport, deleteReport } from "./actions"
import { List, Grid, Download, Loader2, CalendarDays, CheckCircle, AlertCircle, LogOut, Copy } from "lucide-react"
import ReportTable from "@/components/report-table"
import ReportCards from "@/components/report-cards"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { formatReportForCopy } from "@/utils"

export default function AdminDashboard() {
  const [isFetching, startFetching] = useTransition()
  const [isDownloading, startDownloading] = useTransition()
  const [isLoggingOut, startLogoutTransition] = useTransition()
  const [isCopyingAll, startCopyingAll] = useTransition()
  const [reports, setReports] = useState([])
  const [viewMode, setViewMode] = useState("table") // 'table' or 'card'
  const [filterDate, setFilterDate] = useState("") // YYYY-MM-DD format
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string } or null

  const router = useRouter()
  
  useEffect(() => {
    startFetching(async () => {
      const fetchedReports = await getReports(filterDate || null)

      // sort our reportss
      fetchedReports.sort((a, b) => {
        const numA = parseInt(a.equipmentTag.replace(/\D/g, ""), 10);
        const numB = parseInt(b.equipmentTag.replace(/\D/g, ""), 10);
        console.log(numA, numB);
        return numA - numB;
      });
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

  
  const handleDeleteReport = async (reportId) => {
    const result = await deleteReport(reportId) // Call the deleteReport action
    if (result.success) {
      setMessage({ type: "success", text: result.message })
      setReports(reports.filter(report => report.id !== reportId)) // Remove the deleted report from the state
    } else {
      setMessage({ type: "error", text: result.message || "Failed to delete report." })
    }
    setTimeout(() => setMessage(null), 5000)
  }


  const handleCopyAllReports = () => {
    if (reports.length === 0) {
      setMessage({ type: "error", text: "No reports to copy." });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    startCopyingAll(async () => {
      const allReportsText = reports.map(formatReportForCopy).join("\n\n---\n\n"); // Join with a separator
      try {
        await navigator.clipboard.writeText(allReportsText);
        setMessage({ type: "success", text: `Details of ${reports.length} reports copied to clipboard!` });
      } catch (err) {
        setMessage({ type: "error", text: "Failed to copy all report details." });
        console.error("Failed to copy all reports: ", err);
      }
      setTimeout(() => setMessage(null), 3000);
    });
  };

  const handleLogout = async () => {
    startLogoutTransition(async () => {
      await signOut()
      router.replace("/login") // Ensure client-side redirect after logout
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="text-left">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-3">Report Dashboard</h1>
            <p className="text-lg text-slate-600">View and manage all submitted equipment reports.</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white shadow-sm"
          >
            {isLoggingOut ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <LogOut className="w-4 h-4 mr-2" />}
            Logout
          </button>
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

          {/* Download and Copy All Buttons */}
          <div className="flex gap-2 w-full md:w-auto justify-center">
            <button
            
              onClick={handleDownload}
              disabled={isDownloading || !filterDate}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white shadow-sm"
            >
              {isDownloading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              Download Daily Report
            </button>
            <button
              onClick={handleCopyAllReports}
              disabled={isCopyingAll || reports.length === 0}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full md:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white shadow-sm"
            >
              {isCopyingAll ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy All Reports
            </button>
          </div>
        </div>

        {/* Reports Display */}
        {isFetching ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-emerald-500" />
            <span className="ml-3 text-lg text-slate-600">Loading reports...</span>
          </div>
        ) : viewMode === "table" ? (
          <ReportTable reports={reports} onDeleteReport={handleDeleteReport} />
        ) : (
          <ReportCards reports={reports} onDeleteReport={handleDeleteReport} />
        )}
      </div>
    </div>
  )
}
