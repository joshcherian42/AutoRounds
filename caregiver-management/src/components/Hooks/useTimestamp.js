import { useState } from "react";
import { addLeadingZero } from "../../utils/formatISOString";
import useClock from "./useClock";

const useTimestamp = (phase, syncDate, clockCleanup) => {
  const [day, setDay] = useState(""); // mm/dd/yyyy
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [meridiem, setMeridiem] = useState("");

  const { clockDate } = useClock(phase, syncDate, clockCleanup);

  const updateTime = (currentTime = true) => {
    const date = new Date(clockDate); //new Date();
    if (!currentTime) {
      date.setMinutes(date.getMinutes() - 5);
    }
    setDay(date.toLocaleDateString());
    const time = date.toLocaleTimeString();

    const _hour = time.split(":")[0];
    const _minute = time.split(":")[1];
    setHour(_hour);
    setMinute(_minute);
    setMeridiem(time.split(" ")[1]);
  };

  const getISOString = () => {
    const y = day.split("/")[2];
    let m = day.split("/")[0];
    let d = day.split("/")[1];

    // Month and Day don't have leading zeros by default
    if (m < 10) {
      m = "0" + m;
    }
    if (d < 10) {
      d = "0" + d;
    }

    let _hour = hour;
    if (meridiem === "PM") {
      if (_hour !== "12") {
        _hour = (parseInt(_hour) + 12).toString();
      }
    } else {
      if (_hour === "12") {
        _hour = "00";
      } else {
        _hour = addLeadingZero(_hour);
      }
    }
    return y + "-" + m + "-" + d + "T" + _hour + ":" + minute + ":00";
  };

  return {
    hour,
    minute,
    meridiem,
    setHour,
    setMinute,
    setMeridiem,
    updateTime,
    getISOString,
  };
};

export default useTimestamp;
