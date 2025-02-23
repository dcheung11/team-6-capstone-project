export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export const getDayOfWeek = (date) => {
  return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
};
