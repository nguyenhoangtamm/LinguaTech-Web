export const convertToApiDateFormat = (
  dateStr: string | undefined
): string | undefined => {
  if (!dateStr) return undefined;
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/").map(Number);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  }
  return dateStr;
};

export const convertToDisplayDateFormat = (
  dateStr: string | undefined
): string | undefined => {
  if (!dateStr) return undefined;
  if (dateStr.includes("-")) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};
