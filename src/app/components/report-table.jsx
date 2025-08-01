import { format } from "date-fns"

export default function ReportTable({ reports }) {
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
              <td className="p-4 align-middle">{format(new Date(report.date), "MMM dd, yyyy")}</td>
              <td className="p-4 align-middle">{report.equipmentTag}</td>
              <td className="p-4 align-middle">{report.location}</td>
              <td className="p-4 align-middle">{`${report.startingRunningHours} / ${report.endingRunningHours}`}</td>
              <td className="p-4 align-middle">{`${report.startingFuelLevel}% / ${report.endingFuelLevel}%`}</td>
              <td className="p-4 align-middle">{report.quantityFuelAdded}</td>
              <td className="p-4 align-middle max-w-[200px] truncate">{report.observations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
