import { useState } from "react";
import {
  Accordion,
  Group,
  Avatar,
  Text,
  SegmentedControl,
} from "@mantine/core";
import Graph from "../../components/Graphs/Graph.js";

function AccordionLabel({ label, image, description, default_value }) {
  return (
    <Group noWrap>
      <Avatar src={image} radius="md" style={{ height: "5vh", width: "5vh" }} />
      <div style={{ display: "flex", paddingLeft: "1vw" }}>
        <Text size="xl">{label}</Text>
        <Text
          style={{ paddingLeft: "3vw" }}
          size="xl"
          color="dimmed"
          weight={400}
        >
          {default_value}
        </Text>
      </div>
    </Group>
  );
}

function getSegmentedControldata(item) {
  let data;

  if (
    item === "Weight" ||
    item === "Blood Pressure" ||
    item === "Heart Rate" ||
    item === "Toileting" ||
    item === "Dressing" ||
    item === "Showering/Bathing" ||
    item === "Physical Activity"
  ) {
    data = [
      { label: "Week", value: "week" },
      { label: "Month", value: "month" },
      { label: "6 Month", value: "6month" },
      { label: "Year", value: "year" },
    ];
  } else if (item === "Medication Intake") {
    data = [
      { label: "Week", value: "week" },
      { label: "Month", value: "month" },
    ];
  } else {
    data = [
      { label: "Day", value: "day" },
      { label: "Week", value: "week" },
      { label: "Month", value: "month" },
      { label: "6 Month", value: "6month" },
      { label: "Year", value: "year" },
    ];
  }
  return data;
}

const GraphAccordion = ({
  item,
  health_data,
  default_value,
  syncDate,
  perscription_data,
}) => {
  let init_value = "day";
  if (
    item.label === "Weight" ||
    item.label === "Blood Pressure" ||
    item.label === "Heart Rate" ||
    item.label === "Toileting" ||
    item.label === "Dressing" ||
    item.label === "Showering/Bathing" ||
    item.label === "Medication Intake" ||
    item.label === "Physical Activity"
  ) {
    init_value = "week";
  }
  const [value, setValue] = useState(init_value);
  const data = getSegmentedControldata(item.label);
  item.default_value = default_value;

  return (
    <div>
      <Accordion
        className="resident_accordion"
        iconPosition="right"
        multiple
        key={item.label}
      >
        <Accordion.Item
          className="resident_accordion_item"
          label={<AccordionLabel {...item} />}
        >
          <div className="resident_time_select">
            <SegmentedControl
              fullWidth
              value={value}
              onChange={setValue}
              data={data}
            />
          </div>
          <Graph
            scale={value}
            metric={item.label}
            health_data={health_data}
            syncDate={syncDate}
            prescription_data={perscription_data}
          />
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default GraphAccordion;
