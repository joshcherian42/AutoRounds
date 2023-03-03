import { SimpleGrid } from "@mantine/core";
import AddMedication from "../AddData/AddMedication";
import formatISOString from "../../utils/formatISOString";

const MedicationContent = ({
  getMedicationInfo,
  resident_name,
  phase,
  syncDate,
  clockCleanup,
  offset,
}) => {
  const { medicationData, medicationTimes, otcData, otcTimes } =
    getMedicationInfo();

  const final_date = syncDate.split("T")[0];

  const getMaxFreq = () => {
    return Math.max(
      ...medicationData.current.map((obj) => parseInt(obj.frequency))
    );
  };

  const timeFormatter = (time) => {
    const vals = time.split(":");
    const hour = parseInt(vals[0]);
    if (hour > 12) {
      return (hour - 12).toString() + ":" + vals[1] + "pm";
    }
    return vals[0] + ":" + vals[1] + "am";
  };

  const frequencyHelper = (item) => {
    let content = [];
    const allMedicationTaken = medicationTimes.current
      .map((obj) => {
        return {
          day: obj["timestamp"].split("T")[0],
          time: obj["timestamp"].split("T")[1],
          prescription_id: obj["fk_prescription_id"],
        };
      })
      .filter((obj) => obj.day === final_date);

    const medicationTaken = allMedicationTaken.filter(
      (obj) => obj.prescription_id === item["prescription_id"]
    );
    let count = medicationTaken.length;
    for (let i = 0; i < item["frequency"]; i++) {
      if (i < count) {
        content.push(
          <AddMedication
            key={item["prescription_id"].toString() + "_taken_" + i.toString()}
            prescription_id={item["prescription_id"]}
            prescription_name={item["name"]}
            button_text={
              "Taken at " + timeFormatter(medicationTaken[i]["time"])
            }
            resident_name={resident_name}
            color={"taken"}
          />
        );
      } else {
        content.push(
          <AddMedication
            key={
              item["prescription_id"].toString() + "_untaken_" + i.toString()
            }
            prescription_id={item["prescription_id"]}
            prescription_name={item["name"]}
            button_text={"Click to Record Dosage"}
            resident_name={resident_name}
            color={"accent"}
            phase={phase}
            syncDate={syncDate}
            clockCleanup={clockCleanup}
            offset={offset}
          />
        );
      }
    }
    const max_freq = getMaxFreq();
    for (let i = 0; i < max_freq - item["frequency"]; i++) {
      content.push(<div key={"blank_" + i.toString()} />);
    }

    return (
      <div style={{ width: "100%" }}>
        <SimpleGrid cols={max_freq + 1} spacing="xl">
          {content}
          <div>
            <div className="medication_item">{item.name}</div>
            <div className="medication_dosage">{item.dosage}</div>
          </div>
        </SimpleGrid>
      </div>
    );
  };

  const otcToday = otcTimes.current.filter(
    (row) => row.timestamp.split("T")[0] === final_date
  );

  const otc_rows = otcData.current
    .filter((d) => otcToday.map((val) => val.fk_otc_id).includes(d.otc_id))
    .map((item) => {
      const subset = otcToday.filter((d) => d.fk_otc_id === item.otc_id);
      return {
        name: item.value,
        number: subset.length,
        last_dosage: formatISOString(
          new Date(
            Math.max(...subset.map((d) => new Date(d.timestamp).getTime()))
          )
        ),
      };
    });

  return (
    <div className="medication_container">
      <div className="medication_sub_section">
        Prescriptions
        <div className="test_bar" />
      </div>
      {medicationData.current.map((item) => (
        <div
          key={item.name}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {frequencyHelper(item)}
        </div>
      ))}
      <div>
        <div className="medication_sub_section">
          Over-the-Counter
          <div className="test_bar" />
        </div>
        <div className="otc_container">
          {otc_rows.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div className="medication_item">{item.name}</div>
                <div className="medication_timestamp">
                  <span className="otc_label">Last Taken At: </span>
                  {timeFormatter(item.last_dosage.split("T")[1])}
                </div>
                <div className="medication_dosage">
                  <span className="otc_label"> Times Taken:</span> {item.number}
                </div>
              </div>
            </div>
          ))}
          {otc_rows.length === 0 && <div className="medication_item">None</div>}
        </div>
      </div>
    </div>
  );
};

export default MedicationContent;
