export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD from ISO format
}

export const getDayOfWeek = (date) => {
  return new Date(date).toLocaleDateString("en-CA", { weekday: "long" });
};
