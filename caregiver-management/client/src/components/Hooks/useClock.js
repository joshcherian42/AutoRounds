import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

const useClock = (phase, syncDate, clockCleanup, isTransmitter = false) => {
  const clockDate = useRef(new Date());
  const [count, setCount] = useState(0);
  const interval = 1000;

  let location = useLocation();

  useEffect(() => {
    clockDate.current = new Date(syncDate);
    var timer = setInterval(() => {
      clockDate.current.setMilliseconds(
        clockDate.current.getMilliseconds() + interval
      );
      setCount((val) => val + 1); // refresh the clock
    }, interval);
    return function cleanup() {
      clearInterval(timer);
    };
  }, [phase]);

  useEffect(() => {
    // Synchronize the time (transmitter only)
    if (isTransmitter) {
      clockCleanup(clockDate.current);
    }
  }, [location.pathname]);

  return {
    clockDate: clockDate.current,
  };
};

export default useClock;
