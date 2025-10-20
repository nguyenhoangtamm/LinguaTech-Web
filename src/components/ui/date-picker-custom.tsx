"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  id?: string;
  value?: string;
  onChange?: (date: string | undefined) => void;
  placeholder?: string;
}

const formatVietnameseDate = (date: Date): string => {
  if (isNaN(date.getTime())) return "Ngày không hợp lệ";
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Chọn ngày",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const parseDate = (dateStr: string): Date | undefined => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const selectedDate = value ? parseDate(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date && !isNaN(date.getTime())) {
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      onChange?.(formattedDate);
    } else {
      onChange?.(undefined);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value && selectedDate ? (
            formatVietnameseDate(selectedDate)
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
