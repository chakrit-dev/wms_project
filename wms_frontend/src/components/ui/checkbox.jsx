import * as React from "react";

export const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    className={`h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 ${className}`}
    ref={ref}
    {...props}
  />
));

Checkbox.displayName = "Checkbox";
