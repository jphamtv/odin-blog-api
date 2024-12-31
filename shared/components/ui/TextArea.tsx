import { ComponentProps } from "react";

interface TextAreaProps extends ComponentProps<"textarea"> {
  label?: string;
  error?: string;
}

export const TextArea = ({
  label,
  error,
  className = "",
  ...props
}: TextAreaProps) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full rounded border px-3 py-2
          focus:outline-none focus:ring-2
          ${error ? "border-red-500" : "border-gray-300"}
          ${className}
        `.trim()}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
