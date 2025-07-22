// Formatter money
export function formatMoney(amount) {
  const options = {
    style: "currency",
    currency: "VND",
  };

  // Constructor to define number according to language
  const formatter = Intl.NumberFormat("vi-VN", options);
  return formatter.format(amount);
}
