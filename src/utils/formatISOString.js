export const addLeadingZero = (val) => {
  if (val < 10) {
    return "0" + val.toString();
  }
  return val.toString();
};

export const formatISOString = (date) => {
  let y = date.getFullYear().toString();
  let m = addLeadingZero(date.getMonth() + 1); // January gives 0
  let d = addLeadingZero(date.getDate());
  let h = addLeadingZero(date.getHours());
  let min = addLeadingZero(date.getMinutes());
  let sec = addLeadingZero(date.getSeconds());
  return y + "-" + m + "-" + d + "T" + h + ":" + min + ":" + sec;
};

export default formatISOString;
