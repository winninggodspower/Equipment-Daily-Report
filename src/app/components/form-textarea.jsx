import { forwardRef } from "react"

const FormTextarea = forwardRef(
  ({ label, name, required = false, placeholder, className = "", rows = 4, ...props }, ref) => {
    return (
      <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          ref={ref}
          id={name}
          name={name}
          rows={rows}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-vertical"
          placeholder={placeholder}
          required={required}
          {...props}
        />
      </div>
    )
  },
)

FormTextarea.displayName = "FormTextarea"

export default FormTextarea
