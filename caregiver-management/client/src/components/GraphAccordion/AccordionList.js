import GraphAccordion from "./GraphAccordion";
import AddData from "../AddData/AddData";
import { LoadingOverlay } from "@mantine/core";

const AccordionList = ({
  acc_list,
  getData,
  getLastVitalValue,
  resident_id,
  first_name,
  last_name,
  otc_options,
  finishedLoading,
  addDataHelper,
  phase,
  syncDate,
  clockCleanup,
}) => {
  return (
    <div>
      <LoadingOverlay visible={!finishedLoading} />
      {acc_list.map((item) => (
        <div className="metric_row">
          <GraphAccordion
            key={item.label}
            item={item}
            health_data={getData(item.label, true)}
            default_value={getLastVitalValue(item.label)}
            syncDate={syncDate}
            perscription_data={getData("Prescriptions", true)}
          />
          <div
            style={{ display: "flex", alignSelf: "start", paddingTop: "6vh" }}
          >
            <AddData
              resident_id={resident_id}
              first_name={first_name}
              last_name={last_name}
              input_label={"Vital"}
              value_label={item.label}
              otc_options={otc_options}
              phase={phase}
              syncDate={syncDate}
              clockCleanup={clockCleanup}
              addHelper={addDataHelper}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccordionList;
