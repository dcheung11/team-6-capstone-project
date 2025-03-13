export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD from ISO format
}
export const getDayOfWeek = (date) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayIndex = new Date(date).getUTCDay(); // Use UTC-based day index
  return days[dayIndex];
};
