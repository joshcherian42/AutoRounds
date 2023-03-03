import React, { Fragment, useState, useEffect } from "react";
import { useMantineTheme, Button } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { ChevronLeft, ChevronRight, CircleCheck } from "tabler-icons-react";
import "chartjs-adapter-luxon";
import "./Graph.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

import { Line, Bar, Scatter } from "react-chartjs-2";
import useChart from "../Hooks/useChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

const getUnit = (metric) => {
  let unit = "";
  switch (metric) {
    case "Blood Pressure":
      unit = "mHg";
      break;
    case "Heart Rate":
      unit = "BPM";
      break;
    case "Blood Glucose":
      unit = "mg/dL";
      break;
    case "Weight":
      unit = "lBs";
      break;
    case "Fluid Intake":
      unit = "Ozs";
      break;
    case "Eating":
      unit = "Cal.";
      break;
    case "Physical Activity":
      unit = "minutes";
      break;
    case "Toileting":
      unit = "";
      break;
    case "Showering/Bathing":
      unit = "";
      break;
    default:
      unit = "";
  }
  return unit;
};

const getChartUnit = (scale) => {
  let chart_unit = "";
  switch (scale) {
    case "day":
      chart_unit = "hour";
      break;
    case "week":
      chart_unit = "day";
      break;
    case "month":
      chart_unit = "day";
      break;
    case "6month":
      chart_unit = "month";
      break;
    case "year":
      chart_unit = "month";
      break;
    default:
      chart_unit = "";
  }
  return chart_unit;
};

function Graph({ scale, metric, health_data, syncDate, prescription_data }) {
  const theme = useMantineTheme();
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  console.log("Chart Data", chartData);
  const [YMin, setYMin] = useState(0);
  const [YMax, setYMax] = useState(0);
  const [month, onMonthChange] = useState(new Date());
  const [weekDate, setWeekDate] = useState(new Date());
  const [dressingWeekDate, setDressingWeekDate] = useState(new Date());

  const [chartOptions, setChartOptions] = useState(false);

  const {
    compressData,
    get_x_scale,
    get_day,
    get_week,
    getChartOptions,
    getMinMax,
    getNestedKeys,
  } = useChart(syncDate);

  useEffect(() => {
    let chart_unit = getChartUnit(scale);
    let chart_x_min = "";
    let chart_x_max = "";
    let stacked = false;
    let unit = getUnit(metric);

    let h_data = [];
    if (metric === "Physical Activity") {
      health_data.current.forEach(function (d) {
        let date = Object.keys(d)[0];
        h_data.push({
          timestamp: date + "T23:59:59",
          light: d[date].light,
          moderate: d[date].moderate,
          vigorous: d[date].vigorous,
        });
      });
    } else {
      h_data = health_data.current;
    }

    let x_bounds = get_x_scale(scale, h_data);
    chart_x_min = x_bounds[0];
    chart_x_max = x_bounds[1];

    if (metric === "Dressing" || metric === "Showering/Bathing") {
      setDressingWeekDate(
        new Date(
          health_data.current[health_data.current.length - 1]["timestamp"]
        )
      );
      onMonthChange(
        new Date(
          health_data.current[health_data.current.length - 1]["timestamp"]
        )
      );
    }

    if (metric === "Physical Activity") {
      let dataset = [];
      let keys = ["light", "moderate", "vigorous"];
      let min = 0;
      let max = 0;
      let min_max;
      let label;
      keys.forEach(function (k, i) {
        if (scale === "week" || scale === "month") {
          label = k + " (Total)";
        } else {
          label = k + " (Avg.)";
        }
        dataset.push({
          label: label,
          data: compressData(h_data, scale, metric, k),
          borderColor: theme.colors.accent[5 + 2 * i],
          backgroundColor: theme.colors.accent[2 + 2 * i],
          parsing: {
            xAxisKey: "timestamp",
            yAxisKey: k,
          },
        });
        min_max = getMinMax(h_data, k);
        min = Math.min(min_max[0], min);
        max = Math.max(min_max[1], max);
      });

      setChartData({
        datasets: dataset,
      });

      setYMin(Math.max(min - 10, 0));
      setYMax(max + 10);
    } else if (metric === "Medication Intake") {
      onMonthChange(
        new Date(
          health_data.current[health_data.current.length - 1]["timestamp"]
        )
      );

      setWeekDate(
        new Date(
          health_data.current[health_data.current.length - 1]["timestamp"]
        )
      );
    } else {
      let keys = getNestedKeys(health_data.current[0], []);
      let data;
      // Binary; no value
      if (
        metric === "Dressing" ||
        metric === "Toileting" ||
        metric === "Showering/Bathing"
      ) {
        data = compressData(health_data.current, scale, metric, "timestamp");
      } else if (metric === "Blood Pressure") {
        data = compressData(health_data.current, scale, metric, "dia");
      } else {
        data = compressData(health_data.current, scale, metric, "value");
      }

      if (
        metric === "Dressing" ||
        metric === "Toileting" ||
        metric === "Showering/Bathing" ||
        metric === "Fluid Intake" ||
        metric === "Eating"
      ) {
        keys = getNestedKeys(data[0], []);
      }

      let dataset;

      if (
        metric === "Dressing" ||
        metric === "Showering/Bathing" ||
        metric === "Eating"
      ) {
        let data_with_assistance = [];
        let data_without_assistance = [];
        if (
          metric === "Dressing" ||
          metric === "Showering/Bathing" ||
          metric === "Eating"
        ) {
          stacked = true;
        }

        data.forEach(function (d) {
          if (metric === "Eating" && scale === "day") {
            if (d.with_assistance === true) {
              data_with_assistance.push({
                timestamp: d.timestamp,
                value: d.value,
              });
            } else {
              data_without_assistance.push({
                timestamp: d.timestamp,
                value: d.value,
              });
            }
          } else {
            data_with_assistance.push({
              timestamp: d.timestamp,
              value: d.with_assistance,
            });

            data_without_assistance.push({
              timestamp: d.timestamp,
              value: d.value - d.with_assistance,
            });
          }
        });

        dataset = [
          {
            data: data_without_assistance,
            borderColor: theme.colors.accent[5],
            backgroundColor: theme.colors.accent[2],
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: "value",
            },
          },
        ];
        if (
          metric === "Dressing" ||
          metric === "Showering/Bathing" ||
          metric === "Eating"
        ) {
          dataset.push({
            data: data_with_assistance,
            borderColor: theme.colors.secondary[5],
            backgroundColor: theme.colors.secondary[2],
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: keys[1],
            },
          });
        }

        if (
          metric === "Dressing" ||
          metric === "Showering/Bathing" ||
          metric === "Eating"
        ) {
          stacked = true;
          dataset[0].label = "Without Assistance";
          dataset[1].label = "With Assistance";
        }
        if (metric === "Eating" && (scale === "week" || scale === "month")) {
          dataset[0].label = dataset[0].label + " (Total)";
          dataset[1].label = dataset[1].label + " (Total)";
        } else if (
          metric === "Eating" &&
          (scale === "6month" || scale === "year")
        ) {
          dataset[0].label = dataset[0].label + " (Avg.)";
          dataset[1].label = dataset[1].label + " (Avg.)";
        }
      } else {
        let y_axis_key;
        if (metric === "Blood Pressure") {
          y_axis_key = "dia";
        } else {
          y_axis_key = "value";
        }
        dataset = [
          {
            data: data,
            borderColor: theme.colors.accent[5],
            backgroundColor: theme.colors.accent[2],
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: y_axis_key,
            },
          },
        ];

        if (metric === "Blood Pressure") {
          dataset[0].label = "dia";
          dataset.push({
            label: "sys",
            data: compressData(health_data.current, scale, metric, "sys"),
            borderColor: theme.colors.secondary[5],
            backgroundColor: theme.colors.secondary[2],
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: "sys",
            },
          });
        }
      }

      if (
        (metric === "Toileting" || metric === "Fluid Intake") &&
        (scale === "week" || scale === "month")
      ) {
        dataset[0].label = "Total";
      } else if (
        (metric === "Toileting" || metric === "Fluid Intake") &&
        (scale === "6month" || scale === "year")
      ) {
        dataset[0].label = "Average";
      }

      setChartData({
        datasets: dataset,
      });

      if (metric === "Medication Intake") {
        setYMin(0);
        setYMax(5);
      } else {
        let min_max_key = "value";
        if (metric === "Blood Pressure") {
          min_max_key = "dia";
        }
        let min_max = getMinMax(data, min_max_key);
        let min = min_max[0];
        let max = min_max[1];
        if (metric === "Blood Pressure") {
          min_max = getMinMax(health_data.current, "sys");
          min = Math.min(min_max[0], min);
          max = Math.max(min_max[1], max);
        }

        setYMin(Math.max(min - 10, 0));
        setYMax(max + 10);

        if (
          metric === "Eating" ||
          metric === "Dressing" ||
          metric === "Showering/Bathing"
        ) {
          setYMin(0);
          if (metric === "Eating") {
            setYMax(3000);
          }
        }
      }
    }

    setChartOptions(
      getChartOptions(
        scale,
        chart_unit,
        chart_x_min,
        chart_x_max,
        YMin,
        YMax,
        stacked,
        unit,
        metric
      )
    );
  }, [scale, YMin, YMax, metric, theme.colors, health_data]);

  function week_med_display(health_data) {
    let week_data = get_week(health_data, weekDate);
    let start_day = new Date(week_data[0][0].timestamp).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
    let end_day = new Date(
      week_data[week_data.length - 1][0].timestamp
    ).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return (
      <div>
        <div className="med_week_buttons">
          <div className="med_week_button_container">
            <Button
              variant="subtle"
              color="dark"
              leftIcon={
                <ChevronLeft
                  strokeWidth="1.75"
                  color="#495057"
                  height={28}
                  width={28}
                />
              }
              onClick={() =>
                setWeekDate(new Date(weekDate.setDate(weekDate.getDate() - 7)))
              }
            />
          </div>
          <div className="week_day_date">
            {start_day} - {end_day}
          </div>
          <div className="med_week_button_container">
            <Button
              variant="subtle"
              color="dark"
              rightIcon={
                <ChevronRight
                  strokeWidth="1.75"
                  color="#495057"
                  height={28}
                  width={28}
                />
              }
              onClick={() =>
                setWeekDate(new Date(weekDate.setDate(weekDate.getDate() + 7)))
              }
            />
          </div>
        </div>
        <div>
          {week_data.map(function (w) {
            let week_date = new Date(w[0].timestamp);
            let week_date_string = week_date.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            let day_of_week = week_date.toLocaleString("en-US", {
              weekday: "long",
            });

            return (
              <div key={w[0].timestamp} className="week_day">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="day_of_week">{day_of_week}</div>
                  <div className="week_day_date">{week_date_string}</div>
                </div>
                <div className="week_day_med_container">
                  {w.map(function (d, i) {
                    let day_date = new Date(d.timestamp);
                    let date_string =
                      "(" +
                      day_date.toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }) +
                      ")";
                    if (d.name === "") {
                      date_string = "";
                    } else {
                      d.name = d.name + " ";
                    }
                    return (
                      <div key={i}>
                        <div>
                          <div>
                            {d.name}{" "}
                            <span
                              style={{
                                fontStyle: "italic",
                                opacity: "0.5",
                              }}
                            >
                              {date_string}
                            </span>
                            &nbsp;
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function boolean_legend() {
    return (
      <div style={{ display: "flex", justifyContent: "end" }}>
        <div className="legend_entry">
          <div
            className="legend_color"
            style={{ backgroundColor: theme.colors.accent[2] }}
          ></div>
          <span style={{ opacity: "50%" }}>Without Assistance</span>
        </div>
        <div className="legend_entry">
          <div
            className="legend_color"
            style={{ backgroundColor: theme.colors.secondary[2] }}
          ></div>
          <span style={{ opacity: "50%" }}>With Assistance</span>
        </div>
      </div>
    );
  }
  function get_with_assistance_check(instance, key) {
    if (instance.with_assistance) {
      return (
        <CircleCheck
          key={key}
          width={32}
          height={32}
          color={theme.colors.secondary[5]}
        />
      );
    } else if (instance.with_assistance === false) {
      return (
        <CircleCheck
          key={key}
          width={32}
          height={32}
          color={theme.colors.accent[5]}
        />
      );
    } else {
      if (instance.name !== "") {
        return (
          <CircleCheck
            key={key}
            width={32}
            height={32}
            color={theme.colors.accent[5]}
          />
        );
      }
    }
  }
  function get_week_day(day) {
    return (
      <th className="mantine-17iyee1 mantine-Calendar-weekdayCell">
        <div className="mantine-Text-root mantine-Calendar-weekday mantine-945c8o">
          {day}
        </div>
      </th>
    );
  }
  function boolean_week(health_data) {
    let week_data = get_week(health_data, dressingWeekDate);

    let month = new Date(week_data[0][0].timestamp).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    return (
      <div className="mantine-Calendar-calendarBase mantine-10md616">
        <div>
          <div className="mantine-1kjbdzr mantine-Calendar-calendarHeader">
            <button
              className="mantine-ActionIcon-hover mantine-ActionIcon-root mantine-Calendar-calendarHeaderControl mantine-lwker9"
              type="button"
              onClick={() =>
                setDressingWeekDate(
                  new Date(
                    dressingWeekDate.setDate(dressingWeekDate.getDate() - 7)
                  )
                )
              }
            >
              <svg
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                style={{ transform: "none" }}
              >
                <path
                  d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <button
              className="mantine-UnstyledButton-root mantine-Calendar-calendarHeaderLevel mantine-1eqq3hs"
              type="button"
            >
              {month}
              <svg
                width="28"
                height="28"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                data-chevron="true"
                className="mantine-1wz3so mantine-Calendar-calendarHeaderLevelIcon"
                style={{ color: "rgb(134, 142, 150)" }}
              >
                <path
                  d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <button
              className="mantine-ActionIcon-hover mantine-ActionIcon-root mantine-Calendar-calendarHeaderControl mantine-lwker9"
              type="button"
              onClick={() =>
                setDressingWeekDate(
                  new Date(
                    dressingWeekDate.setDate(dressingWeekDate.getDate() + 7)
                  )
                )
              }
            >
              <svg
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                style={{ transform: "rotate(180deg)" }}
              >
                <path
                  d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <table className="mantine-Calendar-month boolean_week mantine-1bsmpxd">
            <thead>
              <tr>
                {get_week_day("Mo")}
                {get_week_day("Tu")}
                {get_week_day("We")}
                {get_week_day("Th")}
                {get_week_day("Fr")}
                {get_week_day("Sa")}
                {get_week_day("Su")}
              </tr>
            </thead>
            <tbody>
              <tr>
                {week_data.map(function (w, i) {
                  let week_date = new Date(w[0].timestamp);
                  let week_date_string = week_date.toLocaleString("en-US", {
                    day: "numeric",
                  });

                  return (
                    <td
                      key={i}
                      className="mantine-1jfndp5 mantine-Calendar-cell"
                    >
                      <button
                        type="button"
                        tabIndex="-1"
                        data-mantine-stop-propagation="true"
                        className="mantine-1ll4s0m mantine-Calendar-day"
                      >
                        <div className="calendar_day">
                          <div
                            style={{
                              marginLeft: "5%",
                              color:
                                week_date.getMonth() !==
                                new Date(week_data[0][0].timestamp).getMonth()
                                  ? "#ced4da"
                                  : "#495057",
                            }}
                          >
                            {week_date_string}
                          </div>
                          <div
                            className="boolean_week_day_container"
                            style={{
                              position: "absolute",
                              width: "-webkit-fill-available",
                            }}
                          >
                            {w.map(function (d, i) {
                              return get_with_assistance_check(d, i);
                            })}
                          </div>
                        </div>
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function calendar_date(metric, date, prescription_data) {
    const day = date.getDate();
    const day_values = get_day(health_data, date);

    if (metric === "Medication Intake") {
      const taken_meds = day_values.map(function (d) {
        return d["name"].trim();
      });
      return (
        <div className="calendar_day">
          <div style={{ marginLeft: "5%" }}>{day}</div>
          <div className="med_check">
            {day_values.length !== 0 && (
              <div>
                {get_with_assistance_check(day_values[0], date)}
                {prescription_data.current.map(function (el, i) {
                  if (!taken_meds.includes(el.name)) {
                    return (
                      <div key={i} className="med_name">
                        {el.name}
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      if (typeof day_values[0] !== "undefined") {
        return (
          <div className="calendar_day">
            <div style={{ marginLeft: "5%" }}>{day}</div>
            <div
              className="boolean_week_day_container"
              style={{
                position: "absolute",
                width: "-webkit-fill-available",
              }}
            >
              {day_values.map((el, i) => get_with_assistance_check(el, i))}
            </div>
          </div>
        );
      } else {
        return (
          <div className="calendar_day">
            <div>{day}</div>
          </div>
        );
      }
    }
  }

  function get_calendar(metric, prescription_data) {
    return (
      <Calendar
        month={month}
        onMonthChange={onMonthChange}
        renderDay={function (date) {
          return calendar_date(metric, date, prescription_data);
        }}
        fullWidth
        size="xl"
        styles={(theme) => ({
          cell: {
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          },
          day: {
            borderRadius: 0,
            textAlign: "left",
            fontSize: theme.fontSizes.md,
          },
          weekday: { fontSize: theme.fontSizes.lg },
          weekdayCell: {
            fontSize: theme.fontSizes.xl,
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[0],
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
            height: 70,
          },
        })}
      />
    );
  }

  return (
    <Fragment>
      {!chartOptions === false && (
        <div className="graph_container">
          {scale === "month" &&
            metric === "Medication Intake" &&
            get_calendar(metric, prescription_data)}
          {scale === "week" &&
            metric === "Medication Intake" &&
            week_med_display(health_data)}
          {(scale === "week" || scale === "month") &&
            (metric === "Dressing" || metric === "Showering/Bathing") &&
            boolean_legend()}
          {scale === "week" &&
            (metric === "Dressing" || metric === "Showering/Bathing") &&
            boolean_week(health_data)}
          {scale === "day" &&
            metric !== "Eating" &&
            metric !== "Fluid Intake" &&
            metric !== "Medication Intake" && (
              <Line options={chartOptions} data={chartData} />
            )}
          {scale === "day" && metric === "Eating" && (
            <Bar options={chartOptions} data={chartData} />
          )}
          {scale === "day" && metric === "Fluid Intake" && (
            <Scatter options={chartOptions} data={chartData} />
          )}
          {scale === "week" &&
            metric !== "Weight" &&
            metric !== "Medication Intake" &&
            metric !== "Dressing" &&
            metric !== "Showering/Bathing" && (
              <Bar options={chartOptions} data={chartData} />
            )}
          {scale === "week" &&
            metric === "Weight" &&
            metric !== "Medication Intake" && (
              <Line options={chartOptions} data={chartData} />
            )}
          {scale === "month" &&
            (metric === "Dressing" || metric === "Showering/Bathing") &&
            get_calendar(metric, prescription_data)}
          {scale === "month" &&
            metric !== "Medication Intake" &&
            metric !== "Dressing" &&
            metric !== "Showering/Bathing" && (
              <Bar options={chartOptions} data={chartData} />
            )}
          {scale === "6month" && metric !== "Medication Intake" && (
            <Bar options={chartOptions} data={chartData} />
          )}
          {scale === "year" && metric !== "Medication Intake" && (
            <Bar options={chartOptions} data={chartData} />
          )}
        </div>
      )}
    </Fragment>
  );
}

export default Graph;
