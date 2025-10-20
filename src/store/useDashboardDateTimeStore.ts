import { create } from "zustand";

interface DateTimeStore {
  selectedDate: string;
  setSelectedDate: (newDate: string) => void;
}

const useDateTimeStore = create<DateTimeStore>((set) => ({
  selectedDate: "",
  setSelectedDate: (newDate) => set({ selectedDate: newDate }),
}));

export default useDateTimeStore;