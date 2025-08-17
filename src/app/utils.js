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

  const startTimeFormatted = startTime !== "N/A"
    ? (() => {
        const [h, m] = startTime.split(":");
        return `${h}H ${m}M`;
      })()
    : "N/A";

  const endTimeFormatted = endTime !== "N/A"
    ? (() => {
        const [h, m] = endTime.split(":");
        return `${h}H ${m}M`;
      })()
    : "N/A";

  return `${formData.equipmentTag}
Operator: ${formData.name}
Date: ${formattedDate}
Equipment Tag: ${formData.equipmentTag}
Location: ${formData.location}
Start Running Hours: ${startTimeFormatted}
Ending Running Hours: ${endTimeFormatted}
Starting Fuel Level: ${formData.startingFuelLevel}%
Ending Fuel Level: ${formData.endingFuelLevel}%
Fuel Added: ${formData.quantityFuelAdded} Ltrs${formData.observations
  ? `
Observations: ${formData.observations}`
  : ""
    }`
}