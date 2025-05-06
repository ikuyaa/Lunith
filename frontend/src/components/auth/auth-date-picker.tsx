import { format} from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/utils/cn-utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type ControllerRenderProps} from "react-hook-form"

type DatePickerProps = {
  field: ControllerRenderProps<any, 'dateOfBirth'>;
}

export function AuthDatePickerCalendar({ field }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            `text-center w-full font-normal md:text-lg`, !field.value && "text-muted-foreground",
          )}
        >
          {field.value ? (
            format(field.value, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
