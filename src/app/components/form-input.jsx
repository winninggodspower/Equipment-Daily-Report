import { forwardRef } from "react"

const FormInput = forwardRef(
  ({ label, name, type = "text", required = false, placeholder, className = "", suffix, ...props }, ref) => {
    return (
      <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={type}
            id={name}
            name={name}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder={placeholder}
            required={required}
            {...props}
          />
          {suffix && <span className="absolute right-3 top-3 text-slate-500">{suffix}</span>}
        </div>
      </div>
    )
  },
)

FormInput.displayName = "FormInput"

export default FormInput
