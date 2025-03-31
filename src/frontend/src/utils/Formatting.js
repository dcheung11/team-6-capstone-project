export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD from ISO format
}
export const getDayOfWeek = (date) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayIndex = new Date(date).getUTCDay(); // Use UTC-based day index
  return days[dayIndex];
};

export function getLocalISODate(date) {
  date.setHours(12, 0, 0, 0);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
}

export const getPopupWeekDates = (date) => {
  let monday = new Date(date);
  const day = monday.getDay();
  if (day === 0) {
    // If Sunday, jump to Monday
    monday.setDate(monday.getDate() + 1);
  } else {
    // Otherwise, back up to Monday
    monday.setDate(monday.getDate() - (day - 1));
  }
  // Return 5 days (Monday to Friday)
  return [...Array(5)].map((_, i) => {
    let dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    const fullDate = getLocalISODate(dayDate);
    return {
      day: dayDate.toLocaleDateString("en-US", { weekday: "long" }),
      date: dayDate.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      fullDate,
    };
  });
};

export function getPopupWeekRange(date) {
  let startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  let endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startStr = startOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const endStr = endOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `${startStr} - ${endStr}`;
}