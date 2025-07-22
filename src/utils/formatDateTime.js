export function formatDate(sValue) {
  const sYear = sValue.slice(0, 4);
  const sMonth = sValue.slice(5, 7);
  const sDate = sValue.slice(8, 10);

  return sDate + "-" + sMonth + "-" + sYear;
}

export function formatTime(sValue) {
  const date = new Date(sValue);

  const sHou = date.getHours();
  const sMin = date.getMinutes();
  const sSec = date.getSeconds();

  const period = sHou >= 12 ? "PM" : "AM";

  return (
    sHou.toString().padStart(2, "0") +
    ":" +
    sMin.toString().padStart(2, "0") +
    ":" +
    sSec.toString().padStart(2, "0") +
    " " +
    period
  );
}
