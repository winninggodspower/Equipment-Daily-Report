"use client"

import { useEffect, useState } from "react"
import { useActionState } from "react"
import { submitEquipmentForm } from "./actions"
import { User, Clock, Fuel, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import FormInput from "@/components/form-input"
import FormTextarea from "@/components/form-textarea"

export default function EquipmentForm() {
  const [form, setForm] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    equipmentTag: "",
    location: "",
    startingRunningHours: "",
    endingRunningHours: "",
    startingFuelLevel: "",
    endingFuelLevel: "",
    quantityFuelAdded: "",
    observations: "",
  })

  const [state, action, isPending] = useActionState(submitEquipmentForm, null)

  // Repopulate form fields on error
  useEffect(() => {
    if (state?.data) setForm(state.data)
    if (state?.success) {
      setForm({
        name: "",
        date: "",
        equipmentTag: "",
        location: "",
        startingRunningHours: "",
        endingRunningHours: "",
        startingFuelLevel: "",
        endingFuelLevel: "",
        quantityFuelAdded: "",
        observations: "",
      })
    }
  }, [state])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Equipment Daily Report</h1>
          <p className="text-slate-600">Track equipment performance and fuel consumption</p>
        </div>

        <form action={action} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">Daily Equipment Log</h2>
            <p className="text-emerald-100 text-sm mt-1">Please fill out all required fields</p>
          </div>

          <div className="p-8">
            {/* Error Messages */}
            {state?.errors && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Please correct the following errors:</h3>
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                      {state.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {state?.success && (
              <div className="mb-8 p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-emerald-800">{state.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-emerald-600" />
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    <FormInput
                      label="Operator Name"
                      name="name"
                      placeholder="Enter operator name"
                      required
                      value={form.name}
                      onChange={handleChange}
                    />

                    <FormInput
                      label="Report Date"
                      name="date"
                      type="date"
                      required
                      value={form.date}
                      onChange={handleChange}
                    />

                    <FormInput
                      label="Equipment Tag"
                      name="equipmentTag"
                      placeholder="e.g., EXC-001"
                      required
                      value={form.equipmentTag}
                      onChange={handleChange}
                    />

                    <FormInput
                      label="Location"
                      name="location"
                      placeholder="Enter work location"
                      required
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Operating Hours
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Starting Hours"
                      name="startingRunningHours"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0.0"
                      required
                      value={form.startingRunningHours}
                      onChange={handleChange}
                    />

                    <FormInput
                      label="Ending Hours"
                      name="endingRunningHours"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0.0"
                      required
                      value={form.endingRunningHours}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-amber-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <Fuel className="w-5 h-5 mr-2 text-amber-600" />
                    Fuel Management
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Starting Fuel (%)"
                        name="startingFuelLevel"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0.0"
                        suffix="%"
                        required
                        value={form.startingFuelLevel}
                        onChange={handleChange}
                      />

                      <FormInput
                        label="Ending Fuel (%)"
                        name="endingFuelLevel"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0.0"
                        suffix="%"
                        required
                        value={form.endingFuelLevel}
                        onChange={handleChange}
                      />
                    </div>

                    <FormInput
                      label="Fuel Added Today"
                      name="quantityFuelAdded"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0.0"
                      suffix="Ltrs"
                      required
                      value={form.quantityFuelAdded}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Notes & Observations
                  </h3>

                  <FormTextarea
                    label="Observations/Remarks"
                    name="observations"
                    rows={5}
                    placeholder="Enter any observations, maintenance notes, or remarks about equipment performance..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-400 disabled:to-emerald-500 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Submitting Report...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Submit Equipment Report
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
