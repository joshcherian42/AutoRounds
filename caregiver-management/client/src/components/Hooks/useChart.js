const useChart = (final_date) => {
  function getChartOptions(
    scale,
    chart_unit,
    chart_x_min,
    chart_x_max,
    chart_y_min,
    chart_y_max,
    stacked,
    unit,
    metric
  ) {
    const zoomOptions = {
      pan: {
        enabled: true,
        mode: "x",
      },
    };

    let options = {
      responsive: true,
      scales: {
        x: {
          type: "time",
          time: {
            unit: chart_unit,
          },
          min: chart_x_min,
          max: chart_x_max,
          stacked: stacked,
        },
        y: {
          min: chart_y_min,
          max: chart_y_max,
          title: { display: true, text: unit },
          stacked: stacked,
        },
      },
      plugins: {
        zoom: zoomOptions,
        legend: {
          display: false,
          position: "top",
          align: "end",
        },
        title: {
          display: true,
          text: (ctx) => {
            let date_display = "";
            if (ctx.chart.scales.x._range) {
              let center_time =
                (ctx.chart.scales.x._range["max"] +
                  ctx.chart.scales.x._range["min"]) /
                2;
              let cur_date = new Date(center_time);
              if (scale === "day") {
                date_display = cur_date.toLocaleString("en-us", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                });
              } else if (scale === "week" || scale === "month") {
                date_display = cur_date.toLocaleString("en-us", {
                  month: "long",
                  year: "numeric",
                });
              } else if (scale === "6month" || scale === "year") {
                date_display = cur_date.toLocaleString("en-us", {
                  year: "numeric",
                });
              }
            }

            return date_display;
          },
          position: "bottom",
        },
      },
    };

    if (
      metric === "Blood Pressure" ||
      metric === "Physical Activity" ||
      ((metric === "Toileting" || metric === "Fluid Intake") &&
        scale !== "day") ||
      stacked === true
    ) {
      options.plugins.legend.display = true;
    }
    return options;
  }

  function get_time_key(a) {
    if (Object.keys(a).includes("timestamp")) {
      return "timestamp";
    } else {
      return "start_time";
    }
  }

  function get_date(date, scale) {
    if (scale === "week" || scale === "month") {
      return date.getDate();
    } else {
      return date.getMonth();
    }
  }

  function compressData(data, scale, metric, unit) {
    if (data.length === 0) {
      return data;
    }
    let new_data = [];
    let cur_day_values = [];
    let total_count = 0;
    let num_with_assistance = 0;
    let keys = Object.keys(data[0]);
    let key = get_time_key(data[0]);
    let date_string = data[0][key].split("T")[0];

    const average = (array) => array.reduce((a, b) => a + b, 0) / array.length;

    if (scale === "day" || (scale === "week" && metric === "Weight")) {
      if (keys.includes("value")) {
        data.forEach(function (d) {
          if (metric === "Eating") {
            new_data.push({
              timestamp: d[key],
              [unit]: d.value,
              with_assistance: d.with_assistance,
            });
          } else {
            new_data.push({
              timestamp: d[key],
              [unit]: d.value,
            });
          }
        });

        return new_data;
      } else {
        return data;
      }
    } else if (
      (scale === "6month" || scale === "year") &&
      (metric === "Fluid Intake" ||
        metric === "Eating" ||
        metric === "Toileting")
    ) {
      let cur_date = get_date(new Date(data[0][key]), "week");
      let cur_month = get_date(new Date(data[0][key]), scale);
      let day_averages = [];
      let assistance_averages = [];

      data.forEach(function (d) {
        let iteration_date = get_date(new Date(d[key]), "week");
        let iteration_month = get_date(new Date(d[key]), scale);
        if (iteration_date !== cur_date) {
          day_averages.push(total_count);
          assistance_averages.push(num_with_assistance);

          if (iteration_month !== cur_month) {
            if (metric === "Eating") {
              new_data.push({
                timestamp: date_string,
                value: average(day_averages),
                with_assistance: average(assistance_averages),
              });
            } else {
              new_data.push({
                timestamp: date_string,
                value: average(day_averages),
              });
            }

            cur_month = get_date(new Date(d[key]), scale);

            date_string = d[key].split("T")[0];
            day_averages = [];
            assistance_averages = [];
          }
          cur_date = get_date(new Date(d[key]), "week");
          total_count = 0;
          num_with_assistance = 0;
        }
        if (unit === "timestamp") {
          total_count += 1;
        } else {
          total_count += Number(d[unit]);
          if (Object.keys(d).includes("with_assistance")) {
            if (d.with_assistance === true) {
              num_with_assistance += Number(d[unit]);
            }
          }
        }
      });
      if (day_averages.length > 0) {
        if (metric === "Eating") {
          new_data.push({
            timestamp: date_string,
            value: average(day_averages),
            with_assistance: num_with_assistance,
          });
        } else {
          new_data.push({
            timestamp: date_string,
            value: average(day_averages),
          });
        }
      }

      return new_data;
    } else {
      let cur_date = get_date(new Date(data[0][key]), scale);

      data.forEach(function (d) {
        let iteration_date = get_date(new Date(d[key]), scale);

        if (iteration_date !== cur_date) {
          if (
            ((metric === "Dressing" ||
              metric === "Toileting" ||
              metric === "Showering/Bathing") &&
              keys.includes("timestamp")) ||
            ((metric === "Fluid Intake" || metric === "Eating") &&
              (scale === "week" || scale === "month"))
          ) {
            new_data.push({
              timestamp: date_string,
              value: total_count,
              with_assistance: num_with_assistance,
            });
          } else {
            new_data.push({
              timestamp: date_string,
              [unit]: average(cur_day_values),
              with_assistance: num_with_assistance,
            });
          }

          cur_date = get_date(new Date(d[key]), scale);
          date_string = d[key].split("T")[0];
          cur_day_values = [];
          total_count = 0;
          num_with_assistance = 0;
        }

        if (
          (metric === "Dressing" ||
            metric === "Toileting" ||
            metric === "Showering/Bathing") &&
          keys.includes("timestamp")
        ) {
          total_count += 1;
          if (Object.keys(d).includes("with_assistance")) {
            if (d.with_assistance === true) {
              num_with_assistance += 1;
            }
          }
        } else if (
          (metric === "Fluid Intake" || metric === "Eating") &&
          (scale === "week" || scale === "month")
        ) {
          total_count += Number(d[unit]);
          if (Object.keys(d).includes("with_assistance")) {
            if (d.with_assistance === true) {
              num_with_assistance += Number(d[unit]);
            }
          }
        } else {
          if (d[unit] !== "null") {
            cur_day_values.push(Number(d[unit]));
          }
        }
      });
      if (
        ((metric === "Dressing" ||
          metric === "Toileting" ||
          metric === "Showering/Bathing") &&
          keys.includes("timestamp")) ||
        ((metric === "Fluid Intake" || metric === "Eating") &&
          (scale === "week" || scale === "month"))
      ) {
        new_data.push({
          timestamp: date_string,
          value: total_count,
          with_assistance: num_with_assistance,
        });
      } else {
        if (cur_day_values.length > 0) {
          new_data.push({
            timestamp: date_string,
            [unit]: average(cur_day_values),
            with_assistance: num_with_assistance,
          });
        }
      }
      return new_data;
    }
  }

  function getMinMax(data, key) {
    let x_values = data.map((val) => val[key]);
    let filtered_x_values = x_values.filter((val) => val !== "null");
    let min = Math.min(...filtered_x_values);
    let max = Math.max(...filtered_x_values);
    return [min, max];
  }

  const getNestedKeys = (data, keys) => {
    if (!(data instanceof Array) && typeof data == "object") {
      Object.keys(data).forEach((key) => {
        if (key !== "date") {
          keys.push(key);
        }
        const value = data[key];
        if (typeof value === "object" && !(value instanceof Array)) {
          getNestedKeys(value, keys);
        }
      });
    }
    return keys;
  };

  function get_x_scale(scale, health_data) {
    let x_min, x_max;

    if (scale === "day") {
      x_min = new Date(final_date);
      x_min.setHours(5);
      x_min.setMinutes(59);
      x_min.setSeconds(59);

      x_max = new Date(final_date);
      x_max.setHours(22);
    } else if (scale === "week") {
      x_min = new Date(final_date);
      x_min.setDate(x_min.getDate() - 7);
      x_min.setHours(23);
      x_min.setMinutes(59);
      x_min.setSeconds(59);

      x_max = new Date(final_date);
      x_max.setHours(6);
    } else if (scale === "month") {
      x_min = new Date(final_date);
      x_min.setMonth(x_min.getMonth() - 1);
      x_min.setDate(x_min.getDate() - 1);

      x_max = new Date(final_date);
      x_max.setHours(6);
    } else if (scale === "6month") {
      x_min = new Date(final_date);
      x_min.setMonth(x_min.getMonth() - 6);
      x_min.setDate(x_min.getDate() - 1);

      x_max = new Date(final_date);
      x_max.setMonth(x_max.getMonth() - 1);
    } else if (scale === "year") {
      x_min = new Date(final_date);
      x_min.setMonth(x_min.getMonth() - 12);
      x_max = new Date(final_date);
      x_max.setMonth(x_max.getMonth() - 1);
    }
    return [x_min, x_max];
  }

  function get_week(health_data, day) {
    let days = [];
    for (let d = 6; d >= 0; d--) {
      while (day.getDay() !== 0) {
        day.setDate(day.getDate() + 1);
      }

      day.setDate(day.getDate() - d);
      let med_data = get_day(health_data, day);

      if (med_data.length === 0) {
        days.push([{ timestamp: day - 1, name: "" }]);
      } else {
        days.push(med_data);
      }
    }
    return days;
  }

  function get_day(health_data, date) {
    return health_data.current.filter(function (m) {
      let m_date = new Date(m.timestamp);
      return (
        m_date.getDate().toString() +
          m_date.getMonth().toString() +
          m_date.getYear().toString() ===
        date.getDate().toString() +
          date.getMonth().toString() +
          date.getYear().toString()
      );
    });
  }

  return {
    compressData,
    get_x_scale,
    get_day,
    get_week,
    getChartOptions,
    getMinMax,
    getNestedKeys,
  };
};

export default useChart;
