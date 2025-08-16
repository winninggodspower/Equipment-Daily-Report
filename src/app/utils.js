import { format } from "date-fns";

export function normalizeToUTC(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}


export const formatTime = (hours, minutes) => {
  const h = hours.toString().padStart(2, "0")
  const m = minutes.toString().padStart(2, "0")
  return `${h}:${m}`
}


export function formatReportForCopy(formData) {
  const formattedDate = formData.date ? format(new Date(formData.date), "MMM dd, yyyy") : "N/A"
  const startTime =
    formData.startHour && formData.startMinute ? formatTime(formData.startHour, formData.startMinute) : "N/A"
  const endTime = formData.endHour && formData.endMinute ? formatTime(formData.endHour, formData.endMinute) : "N/A"

  return `DG 35
Operator: ${formData.name}
Date: ${formattedDate}
Equipment Tag: ${formData.equipmentTag}
Location: ${formData.location}
Start Time: ${startTime}
End Time: ${endTime}
Starting Fuel: ${formData.startingFuelLevel}%
Ending Fuel: ${formData.endingFuelLevel}%
Fuel Added: ${formData.quantityFuelAdded} Ltrs${formData.observations
  ? `
Observations: ${formData.observations}`
  : ""
    }`
}