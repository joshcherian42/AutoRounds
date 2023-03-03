import { useRef, useState, useEffect } from "react";
import formatISOString from "../../utils/formatISOString";

function getOffset(d, time_key) {
  let total_length = 900;
  let date_val = d[time_key];
  let time_string = date_val.split("T")[1];
  let minutes =
    (Number(time_string.split(":")[0]) - 6) * 60 +
    Number(time_string.split(":")[1]);
  let offset = (total_length * minutes) / 1080;
  return offset;
}

function sort_dates(a, b) {
  let a_time_key = get_time_key(a);
  let b_time_key = get_time_key(b);

  var dateA = new Date(a[a_time_key]).getTime();
  var dateB = new Date(b[b_time_key]).getTime();
  return dateA > dateB ? 1 : -1;
}

function get_time_key(a) {
  if (Object.keys(a).includes("timestamp")) {
    return "timestamp";
  } else {
    return "start_time";
  }
}

const getAverage = (arr) => {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
};

const useTracking = (resident_id, syncDate) => {
  const bathroomData = useRef([]);
  const dressingData = useRef([]);
  const eatingData = useRef([]);
  const fluidData = useRef([]);
  const physicalData = useRef([]);
  const showeringData = useRef([]);
  const medicationData = useRef([]);
  const medicationTimes = useRef([]);
  const otcData = useRef([]);
  const otcTimes = useRef([]);

  const bloodPressureData = useRef([]);
  const heartRateData = useRef([]);
  const glucoseData = useRef([]);
  const weightData = useRef([]);

  const aggBathroomData = useRef([]);
  const aggEatingData = useRef([]);
  const aggFluidData = useRef([]);
  // const [aggPhysicalData, setAggPhysicalData] = useState([]);
  const aggPhysicalData = useRef([]);

  const [finishedLoading, setFinishedLoading] = useState(false);
  const [updatedData, setUpdatedData] = useState(0);
  const clockDate = new Date(syncDate);
  const final_date = formatISOString(clockDate).split("T")[0];

  function getData(adl_type, agg_amb) {
    switch (adl_type) {
      case "Toileting":
        return bathroomData;
      case "Dressing":
        return dressingData;
      case "Eating":
        return eatingData;
      case "Fluid Intake":
        return fluidData;
      case "Showering/Bathing":
        return showeringData;
      case "Physical Activity":
        if (agg_amb) {
          return aggPhysicalData;
        } else {
          return physicalData;
        }
      case "Medication Intake":
        let medData = {
          current: medicationTimes.current.map((m) => {
            return {
              timestamp: m.timestamp,
              name: medicationData.current.filter(
                (obj) => obj.prescription_id === m.fk_prescription_id
              )[0]["name"],
            };
          }),
        };
        return medData;
      case "Prescriptions":
        return medicationData;
      case "Blood Pressure":
        return bloodPressureData;
      case "Heart Rate":
        return heartRateData;
      case "Blood Glucose":
        return glucoseData;
      case "Weight":
        return weightData;
      default:
        return bathroomData;
    }
  }

  const filterData = (data, time_key) => {
    return data.filter((row) => new Date(row[time_key]) < clockDate);
  };

  const loadMetric = async (path, ref, time_key) => {
    return new Promise((resolve, reject) => {
      ref.current = [];
      fetch(path + "JSON", {
        method: "POST",
        body: JSON.stringify({
          resident_id: resident_id,
        }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (res.ok) {
          res.json().then((data1) => {
            ref.current = filterData(data1, time_key);
            resolve(true);

            // fetch(path, {
            //   method: "POST",
            //   body: JSON.stringify({
            //     resident_id,
            //   }),
            //   headers: { "Content-Type": "application/json" },
            // }).then((res) => {
            //   if (res.ok) {
            //     res.json().then((data2) => {
            //       ref.current = filterData(data1, time_key).concat(
            //         filterData(data2, time_key)
            //       );
            //       resolve(true);
            //     });
            //   }
            // });
          });
        }
      });
    });
  };

  const loadPrescriptions = async () => {
    // return new Promise((resolve, reject) => {
    //   fetch("/api/loadPrescriptions", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       resident_id: resident_id,
    //     }),
    //     headers: { "Content-Type": "application/json" },
    //   }).then((res) => {
    //     if (res.ok) {
    //       res.json().then((data) => {
    //         medicationData.current = data.sort((a, b) =>
    //           a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    //         );
    //         resolve(true);
    //       });
    //     }
    //   });
    // });
  };

  const loadOTC = async () => {
    // return new Promise((resolve, reject) => {
    //   fetch("/api/loadOTC", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //   }).then((res) => {
    //     if (res.ok) {
    //       res.json().then((data) => {
    //         otcData.current = data
    //           .map((row) => {
    //             return {
    //               value: row.name,
    //               otc_id: row.otc_id,
    //               name: row.name,
    //             };
    //           })
    //           .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    //         resolve(true);
    //       });
    //     }
    //   });
    // });
  };

  const addDataHelper = (value_type, row) => {
    switch (value_type) {
      case "dressing":
        dressingData.current.push(row);
        dressingData.current.sort(sort_dates);
        break;
      case "eating":
        eatingData.current.push(row);
        eatingData.current.sort(sort_dates);
        aggEatingData.current = aggregateEatingFluidData("Eating");
        break;
      case "fluids":
        fluidData.current.push(row);
        fluidData.current.sort(sort_dates);
        aggFluidData.current = aggregateEatingFluidData("Fluids");
        break;
      case "otc":
        otcTimes.current.push(row);
        otcTimes.current.sort(sort_dates);
        break;
      case "prescription":
        medicationTimes.push(row);
        medicationTimes.current.sort(sort_dates);
        break;
      case "ambulation":
        physicalData.current.push(row);
        physicalData.current.sort(sort_dates);
        aggPhysicalData.current = aggregatePhysicalData();
        break;
      case "showering":
        showeringData.current.push(row);
        showeringData.current.sort(sort_dates);
        break;
      case "toileting":
        bathroomData.current.push(row);
        bathroomData.current.sort(sort_dates);
        aggBathroomData.current = aggregateTimestampedData("Toileting");
        break;
      case "glucose":
        glucoseData.current.push(row);
        glucoseData.current.sort(sort_dates);
        break;
      case "weight":
        weightData.current.push(row);
        weightData.current.sort(sort_dates);
        break;
      case "heart_rate":
        heartRateData.current.push(row);
        heartRateData.current.sort(sort_dates);
        break;
      case "blood_pressure":
        bloodPressureData.current.push(row);
        bloodPressureData.current.sort(sort_dates);
        break;
      default:
        console.log("Invalid value_type passed to addDataHelper:", value_type);
        break;
    }
    setUpdatedData((val) => val + 1);
  };

  useEffect(() => {
    console.log("Loading JSON data");
    setFinishedLoading(false);
    bathroomData.current = [];
    dressingData.current = [];
    eatingData.current = [];
    fluidData.current = [];
    physicalData.current = [];
    showeringData.current = [];

    //   prescriptions
    // fk_resident_id	int
    // prescription_id	serial
    // name			text
    // drug_type		text
    // dosage		text
    // frequency		text
    // medicationData.current = [];
    medicationData.current = [
      {
        fk_resident_id: 1,
        prescription_id: 1,
        name: "Xarelto",
        drug_type: "prescription",
        dosage: "10 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 1,
        prescription_id: 2,
        name: "Evista",
        drug_type: "prescription",
        dosage: "5 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 1,
        prescription_id: 3,
        name: "Lexapro",
        drug_type: "prescription",
        dosage: "5 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 1,
        prescription_id: 4,
        name: "Multivitamin",
        drug_type: "prescription",
        dosage: "1",
        frequency: "1",
      },
      {
        fk_resident_id: 1,
        prescription_id: 5,
        name: "Vaseretic",
        drug_type: "prescription",
        dosage: "25 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 1,
        prescription_id: 6,
        name: "Lidocaine Patch",
        drug_type: "prescription",
        dosage: "4 %",
        frequency: "1",
      },
      {
        fk_resident_id: 2,
        prescription_id: 7,
        name: "Sertraline",
        drug_type: "prescription",
        dosage: "40 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 2,
        prescription_id: 8,
        name: "Lexapro",
        drug_type: "prescription",
        dosage: "5 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 2,
        prescription_id: 9,
        name: "Xarelto",
        drug_type: "prescription",
        dosage: "10 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 2,
        prescription_id: 10,
        name: "Lidocaine Patch",
        drug_type: "prescription",
        dosage: "4 %",
        frequency: "1",
      },
      {
        fk_resident_id: 2,
        prescription_id: 11,
        name: "Evista",
        drug_type: "prescription",
        dosage: "5 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 2,
        prescription_id: 12,
        name: "Multivitamin",
        drug_type: "prescription",
        dosage: "1",
        frequency: "1",
      },
      {
        fk_resident_id: 2,
        prescription_id: 13,
        name: "Omeprazole",
        drug_type: "prescription",
        dosage: "20 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 2,
        prescription_id: 14,
        name: "Vaseretic",
        drug_type: "prescription",
        dosage: "25 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 3,
        prescription_id: 1,
        name: "Omeprazole",
        drug_type: "prescription",
        dosage: "20 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 4,
        prescription_id: 1,
        name: "Lisinopril",
        drug_type: "prescription",
        dosage: "10 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 5,
        prescription_id: 1,
        name: "Xarelto",
        drug_type: "prescription",
        dosage: "10 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 6,
        prescription_id: 1,
        name: "Metformin",
        drug_type: "prescription",
        dosage: "500 mg",
        frequency: "2",
      },
      {
        fk_resident_id: 7,
        prescription_id: 1,
        name: "Crestor",
        drug_type: "prescription",
        dosage: "10 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 8,
        prescription_id: 1,
        name: "Vaseretic",
        drug_type: "prescription",
        dosage: "25 mg",
        frequency: "1",
      },
      {
        fk_resident_id: 9,
        prescription_id: 1,
        name: "Lexapro",
        drug_type: "prescription",
        dosage: "5 mg",
        frequency: "1",
      },
    ];

    medicationTimes.current = [];
    // otcData.current = [];
    otcData.current = [
      { name: "Acetaminophen", value: "Acetaminophen", otc_id: 1 },
      { name: "Pseudoephedrine", value: "Pseudoephedrine", otc_id: 2 },
    ];
    otcTimes.current = [];

    bloodPressureData.current = [];
    heartRateData.current = [];
    glucoseData.current = [];
    weightData.current = [];

    Promise.all([
      loadMetric("/api/loadAmbulation", physicalData, "end_time"),
      loadMetric("/api/loadBathroom", bathroomData, "timestamp"),
      loadMetric("/api/loadEating", eatingData, "end_time"),
      loadMetric("/api/loadFluids", fluidData, "timestamp"),
      loadMetric("/api/loadDressing", dressingData, "timestamp"),
      loadMetric("/api/loadShowering", showeringData, "timestamp"),
      loadMetric("/api/loadBloodPressure", bloodPressureData, "timestamp"),
      loadMetric("/api/loadHeartRate", heartRateData, "timestamp"),
      loadMetric("/api/loadGlucose", glucoseData, "timestamp"),
      loadMetric("/api/loadWeight", weightData, "timestamp"),

      // loadPrescriptions(),
      // loadOTC(),
      loadMetric("/api/loadTakingMedication", medicationTimes, "timestamp"),
      // loadMetric("/api/loadTakingOTC", otcTimes, "timestamp"),
    ]).then(() => {
      console.log("ALL DONE");
      // Aggregate data
      aggBathroomData.current = aggregateTimestampedData("Toileting");
      aggEatingData.current = aggregateEatingFluidData("Eating");
      aggFluidData.current = aggregateEatingFluidData("Fluids");
      aggPhysicalData.current = aggregatePhysicalData();

      console.log("Medication times:", medicationTimes.current.length);

      // Clear loading modal
      setFinishedLoading(true);
    });
  }, [syncDate]);

  function aggregatePhysicalData() {
    let cur_date = physicalData.current[0]["end_time"].split("T")[0];
    let agg_data = [];
    let light_amb = 0;
    let mod_amb = 0;
    let vig_amb = 0;

    physicalData.current.forEach(function (d) {
      let start_date = d["end_time"].split("T")[0];
      if (start_date === cur_date) {
        let diff =
          (new Date(d["end_time"]) - new Date(d["start_time"])) / 60000;
        switch (d["activity_type"]) {
          case "light":
            light_amb += diff;
            break;
          case "moderate":
            mod_amb += diff;
            break;
          case "vigorous":
            vig_amb += diff;
            break;
          default:
            break;
        }
      } else {
        let row = {
          [cur_date]: {
            light: light_amb,
            moderate: mod_amb,
            vigorous: vig_amb,
          },
        };
        agg_data.push(row);
        cur_date = start_date;
        light_amb = 0;
        mod_amb = 0;
        vig_amb = 0;
        let diff =
          (new Date(d["end_time"]) - new Date(d["start_time"])) / 60000;
        switch (d["activity_type"]) {
          case "light":
            light_amb = diff;
            break;
          case "moderate":
            mod_amb = diff;
            break;
          case "vigorous":
            vig_amb = diff;
            break;
          default:
            break;
        }
      }
    });
    let row = {
      [cur_date]: {
        light: light_amb,
        moderate: mod_amb,
        vigorous: vig_amb,
      },
    };
    agg_data.push(row);

    return agg_data;
  }

  //bathroom
  function aggregateTimestampedData(adl_type) {
    let agg_data = [];
    let raw_data;
    switch (adl_type) {
      case "Toileting":
        raw_data = bathroomData;
        break;
      default:
        raw_data = [];
    }

    let cur_date = raw_data.current[0]["timestamp"].split("T")[0];
    let count = 1;
    raw_data.current.sort(sort_dates);
    raw_data.current.forEach(function (d) {
      let instance_date = d["timestamp"].split("T")[0];
      if (cur_date === instance_date) {
        count += 1;
      } else {
        let row = { [cur_date]: count };
        agg_data.push(row);
        cur_date = instance_date;
        count = 1;
      }
    });
    if (cur_date === final_date) {
      let row = { [cur_date]: count };
      agg_data.push(row);
    }
    return agg_data;
  }

  function aggregateEatingFluidData(adl_type) {
    let agg_data = [];
    let raw_data;
    let date_key;

    switch (adl_type) {
      case "Fluids":
        raw_data = fluidData;
        date_key = "timestamp";
        break;
      case "Eating":
        raw_data = eatingData;
        date_key = "start_time";
        break;
      default:
        date_key = "";
        raw_data = [];
    }

    let cur_date = raw_data.current[0][date_key].split("T")[0];
    let value = 0;

    raw_data.current.sort(sort_dates);
    raw_data.current.forEach(function (d) {
      let instance_date = d[date_key].split("T")[0];
      if (cur_date === instance_date) {
        value += d["value"];
      } else {
        let row = { [cur_date]: value };
        agg_data.push(row);
        cur_date = instance_date;
        value = d["value"];
      }
    });
    let row = { [cur_date]: value };
    agg_data.push(row);
    return agg_data;
  }

  function getDayActivities() {
    let last_day_entries = [];
    let last_day_activities = [];

    if (
      eatingData.current.length !== 0 &&
      bathroomData.current.length !== 0 &&
      dressingData.current.length !== 0 &&
      fluidData.current.length !== 0 &&
      physicalData.current.length !== 0 &&
      showeringData.current.length !== 0 &&
      medicationTimes.current.length !== 0
    ) {
      let adls = [
        "Toileting",
        "Dressing",
        "Eating",
        "Fluid Intake",
        "Physical Activity",
        "Showering/Bathing",
        "Medication Intake",
      ];

      let adl_data;
      let time_key;
      let cluster = [];
      let avg = 0;
      let times;

      adls.forEach(function (adl) {
        adl_data = getData(adl, false);
        time_key = get_time_key(adl_data.current[adl_data.current.length - 1]);

        // Grab only final day data
        let filtered_data = adl_data.current.filter(
          (d) => d[time_key].split("T")[0] === final_date
        );

        if (adl !== "Physical Activity" && adl !== "Eating") {
          // Cluster activities with nearby timestamps
          filtered_data.sort(sort_dates);
          times = filtered_data.map((val) => new Date(val[time_key]).getTime());
          cluster = [];
          avg = 0;
          times.forEach((d) => {
            avg = getAverage(cluster);
            if (avg !== 0 && Math.abs(d - avg) > 3600 * 1000) {
              last_day_entries.push({
                activity: adl,
                timestamp: formatISOString(new Date(Math.max(...cluster))),
              });
              cluster = [];
            }
            cluster.push(d);
          });
          // Push final cluster
          avg = getAverage(cluster);
          last_day_entries.push({
            activity: adl,
            timestamp: formatISOString(new Date(Math.max(...cluster))),
          });
        } else {
          // Add events to last_day_entries
          filtered_data.forEach((d) => {
            last_day_entries.push({ activity: adl, ...d });
          });
        }
      });

      // Prepare the day activities
      last_day_entries.sort(sort_dates);
      last_day_entries.forEach(function (d, day_id) {
        let time_key = get_time_key(d);
        d["id"] = day_id;
        d["offset"] = getOffset(d, time_key);
        last_day_activities.push(d);
      });
    }

    return last_day_activities;
  }

  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  function getLastVitalValue(vital_type) {
    let data = getData(vital_type, false);

    if (data.current.length === 0) {
      return "---";
    }
    let units = "";
    switch (vital_type) {
      case "Blood Pressure":
        units = "mHg";
        break;
      case "Heart Rate":
        units = "BPM";
        break;
      case "Blood Glucose":
        units = "mg/dL";
        break;
      case "Weight":
        units = "lBs";
        break;
      default:
        units = "";
        break;
    }

    if (vital_type === "Blood Pressure") {
      const filtered_data = data.current.filter((row) => row.sys !== "null");

      let sys = filtered_data[filtered_data.length - 1].sys;
      let dia = filtered_data[filtered_data.length - 1].dia;
      let timestamp = new Date(
        filtered_data[filtered_data.length - 1].timestamp
      );

      return (
        <div className="vitals_container">
          <div>
            {sys}/{dia} {units}
          </div>
          <div className="vital_timestamp">
            {timestamp.getMonth()}/{timestamp.getDate()}/
            {timestamp.getFullYear()} {timestamp.getHours()}:
            {addZero(timestamp.getMinutes())}{" "}
            {timestamp.getHours() >= 12 ? "PM" : "AM"}
          </div>
        </div>
      );
    } else if (
      vital_type === "Heart Rate" ||
      vital_type === "Blood Glucose" ||
      vital_type === "Weight"
    ) {
      const filtered_data = data.current.filter((row) => row.value !== "null");
      let timestamp = new Date(
        filtered_data[filtered_data.length - 1].timestamp
      );

      return (
        <div className="vitals_container">
          <div>
            {filtered_data[filtered_data.length - 1].value} {units}
          </div>
          <div className="vital_timestamp">
            {timestamp.getMonth()}/{timestamp.getDate()}/
            {timestamp.getFullYear()} {timestamp.getHours()}:
            {addZero(timestamp.getMinutes())}{" "}
            {timestamp.getHours() >= 12 ? "PM" : "AM"}
          </div>
        </div>
      );
    } else {
      return "";
    }
  }

  const getMedicationInfo = () => {
    return {
      medicationData,
      medicationTimes,
      otcData,
      otcTimes,
    };
  };

  const getAggData = () => {
    return {
      aggBathroomData,
      aggEatingData,
      aggFluidData,
      aggPhysicalData,
    };
  };

  return {
    getData,
    getAggData,
    getMedicationInfo,
    getLastVitalValue,
    getDayActivities,
    getOffset,
    otc_options: otcData.current,
    finishedLoading,
    addDataHelper,
  };
};

export default useTracking;
