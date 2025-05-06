import * as React from "react"
import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/utils/cn-utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MIN_SIGNUP_AGE } from "@shared/config/auth.config"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { type ControllerRenderProps } from "react-hook-form"

interface DatePickerProps {
  startYear?: number
  endYear?: number
  field: ControllerRenderProps<any, 'dateOfBirth'>;

}

export function RegisterDatePicker({
  startYear = new Date().getFullYear() - MIN_SIGNUP_AGE,
  endYear = 1900,
  field
}: DatePickerProps) {
  const today = new Date();
  const minAgeDate = new Date(today.getFullYear() - MIN_SIGNUP_AGE, today.getMonth(), today.getDate())
  const [date, setDate] = React.useState<Date>(minAgeDate);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: startYear - endYear + 1 }, (_, i) => startYear - i);
  
  const handleMonthChange = (month: string, field: ControllerRenderProps<any, 'dateOfBirth'>) => {
    const newDate = setMonth(date, months.indexOf(month));
    field.onChange(newDate);
    setDate(newDate);
  }

  const handleYearChange = (year: string, field: ControllerRenderProps<any, 'dateOfBirth'>) => {
    const newDate = setYear(date, parseInt(year));
    field.onChange(newDate);
    setDate(newDate);
  }

  const handleDateSelect = (selectedDate: Date | undefined, field: ControllerRenderProps<any, 'dateOfBirth'>) => {
    if(selectedDate) {
      field.onChange(selectedDate);
      setDate(selectedDate);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <div className="flex items-center text-center justify-center mx-auto -translate-x-2">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          {/* Month */}
          <Select onValueChange={(val) => handleMonthChange(val, field)} value={months[getMonth(date)]}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="h-[280px]">
              {months.map(month => (
                <SelectItem value={month} key={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Year */}
          <Select onValueChange={(val) => handleYearChange(val, field)} value={getYear(date).toString()}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="h-[280px]">
              {years.map(year => (
                <SelectItem value={year.toString()} key={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => handleDateSelect(newDate, field)}
          initialFocus
          onMonthChange={setDate}
          toDate={minAgeDate}
          month={date}
      />
      </PopoverContent>
    </Popover>
  )
}
