import { date } from "quasar";

export const useDate = () => {
  function logDateFormat(timestamp) {
    return date.formatDate(timestamp, "MMM D, YYYY");
  }

  function logTimeFormat(timestamp) {
    return date.formatDate(timestamp, "h:mm a");
  }

  function fileDateFormat(timestamp) {
    return date.formatDate(timestamp, "MM-DD-YYYY");
  }

  function numberSlashFormat(timestamp) {
    return date.formatDate(timestamp, "MM/DD/YYYY");
  }

  return { logDateFormat, logTimeFormat, fileDateFormat, numberSlashFormat };
};
