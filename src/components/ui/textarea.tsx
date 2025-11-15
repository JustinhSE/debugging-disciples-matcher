import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-[#27272a] placeholder:text-[#808080] focus-visible:border-[#06b6d4] focus-visible:ring-[#06b6d4]/50 bg-[#18181b] flex field-sizing-content min-h-16 w-full rounded-md border text-white px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
