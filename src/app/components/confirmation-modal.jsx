"use client"

import { X, Copy, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { formatReportForCopy, formatTime } from "@/utils"

export default function ConfirmationModal({ isOpen, onClose, onSubmit, formData, isSubmitting }) {
  const [isCopying, setIsCopying] = useState(false)

  if (!isOpen) return null

  const handleCopy = async () => {
    setIsCopying(true)
    try {
      let copyText = formatReportForCopy(formData)

      await navigator.clipboard.writeText(copyText)
    } catch (err) {
      console.error("Failed to copy: ", err)
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Confirm Report Submission</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-slate-600">Please review your report details before submitting:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Operator:</span> {formData.name}
                </div>
                <div>
                  <span className="font-medium">Date:</span>{" "}
                  {formData.date ? format(new Date(formData.date), "MMM dd, yyyy") : "N/A"}
                </div>
                <div>
                  <span className="font-medium">Equipment Tag:</span> {formData.equipmentTag}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {formData.location}
                </div>
              </div>
            </div>

            {/* Time Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Engine Running Hours</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Start Time:</span>{" "}
                  {formData.startHour && formData.startMinute
                    ? formatTime(formData.startHour, formData.startMinute)
                    : "N/A"}
                </div>
                <div>
                  <span className="font-medium">End Time:</span>{" "}
                  {formData.endHour && formData.endMinute ? formatTime(formData.endHour, formData.endMinute) : "N/A"}
                </div>
              </div>
            </div>

            {/* Fuel Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Fuel Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Starting Fuel:</span> {formData.startingFuelLevel}%
                </div>
                <div>
                  <span className="font-medium">Ending Fuel:</span> {formData.endingFuelLevel}%
                </div>
                <div>
                  <span className="font-medium">Fuel Added:</span> {formData.quantityFuelAdded} Ltrs
                </div>
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Observations</h3>
              <div className="text-sm">
                <div className="bg-slate-50 p-3 rounded-lg min-h-[80px]">
                  {formData.observations || "No observations provided"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            disabled={isSubmitting || isCopying}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isCopying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            Copy Details
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Submit Report
          </button>
        </div>
      </div>
    </div>
  )
}