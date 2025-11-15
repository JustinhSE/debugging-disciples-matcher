import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-white placeholder:text-[#808080] selection:bg-[#06b6d4] selection:text-[#000000] bg-[#18181b] border-[#27272a] h-9 w-full min-w-0 rounded-md border text-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[#06b6d4] focus-visible:ring-[#06b6d4]/50 focus-visible:ring-[3px]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
