import { Fragment, useState } from "react";
import {
  Grid,
  Button,
  Box,
  Modal,
  useMantineTheme,
  Group,
  Select,
  NumberInput,
  Switch,
  Title,
  Autocomplete,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import useTimestamp from "../Hooks/useTimestamp";

import { ReactComponent as HangerComp } from "../Summary/svgs/hanger.svg";
import { ReactComponent as PillComp } from "../Summary/svgs/pill.svg";
import { ReactComponent as ToiletPaperComp } from "../Summary/svgs/toilet-paper.svg";
import { ReactComponent as ToolsKitchen2Comp } from "../Summary/svgs/tools-kitchen-2.svg";
import { ReactComponent as GlassFullComp } from "../Summary/svgs/glass-full.svg";
import { ReactComponent as WalkComp } from "../Summary/svgs/walk.svg";
import { ReactComponent as BathComp } from "../Summary/svgs/bath.svg";
import { ReactComponent as XComp } from "../Summary/svgs/x.svg";
import { ReactComponent as ActivityComp } from "../Summary/svgs/activity.svg";

import { Plus } from "tabler-icons-react";

// Map of display name from Summary to local value_type option
const all_options = {
  Toileting: "toileting",
  Dressing: "dressing",
  "Showering/Bathing": "showering",
  Eating: "eating",
  "Fluid Intake": "fluids",
  "Physical Activity": "ambulation",
  "Blood Pressure": "blood_pressure",
  "Heart Rate": "heart_rate",
  "Blood Glucose": "glucose",
  Weight: "weight",
  "Medication Intake": "otc",
  "Over-the-Counter": "otc",
};

// Map of display name to corresponding Mantine theme name
const button_colors = {
  Toileting: "toileting",
  Dressing: "dressing",
  "Showering/Bathing": "showering",
  Eating: "eating",
  "Fluid Intake": "fluids",
  "Physical Activity": "physical",
  "Blood Pressure": "accent",
  "Heart Rate": "accent",
  "Blood Glucose": "accent",
  Weight: "accent",
  "Medication Intake": "medication",
};

const AddData = ({
  resident_id,
  first_name,
  last_name,
  value_label,
  otc_options,
  phase,
  syncDate,
  clockCleanup,
  addHelper,
}) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const value_type = all_options[value_label];
  const button_color = button_colors[value_label];

  const hour_options = [...Array(12).keys()].map((val) => (val + 1).toString());
  const minute_options = [...Array(60).keys()].map((val) => {
    if (val < 10) {
      return "0" + val.toString();
    }
    return val.toString();
  });

  const {
    hour,
    minute,
    meridiem,
    setHour,
    setMinute,
    setMeridiem,
    updateTime,
    getISOString,
  } = useTimestamp(phase, syncDate, clockCleanup);

  const {
    hour: startHour,
    minute: startMinute,
    meridiem: startMeridiem,
    setHour: setStartHour,
    setMinute: setStartMinute,
    setMeridiem: setStartMeridiem,
    updateTime: updateStartTime,
    getISOString: getStartISOString,
  } = useTimestamp(phase, syncDate, clockCleanup);

  const openHelper = () => {
    setOpened(true);
    updateTime();
    updateStartTime(false);
  };

  let resident_name = first_name + " " + last_name;

  const default_form = {
    residentName: resident_name,
    valueType: value_label,
    prescriptionNumber: 0,
    value: "",
    sys: "",
    dia: "",
    withAssistance: false,
  };

  const addDataForm = useForm({
    initialValues: default_form,
  });

  const getNotificationParams = (value_type) => {
    let activity_icon;
    let color_name;
    let message;
    let background_color;
    switch (value_type) {
      case "dressing":
        color_name = "dressing";
        message = "dressing";
        activity_icon = <HangerComp />;
        background_color = "#fff1d5";
        break;
      case "eating":
        color_name = "eating";
        message = "eating";
        activity_icon = <ToolsKitchen2Comp />;
        background_color = "#a6e4aa";
        break;
      case "fluids":
        color_name = "fluids";
        message = "fluid intake";
        activity_icon = <GlassFullComp />;
        background_color = "#ffe8d5";
        break;
      case "ambulation":
        color_name = "physical";
        message = "physical activity";
        activity_icon = <WalkComp />;
        background_color = "#ffd6d5";
        break;
      case "toileting":
        color_name = "toileting";
        message = "toileting";
        activity_icon = <ToiletPaperComp />;
        background_color = "#cec5e9";
        break;
      case "showering":
        color_name = "showering";
        message = "showering";
        activity_icon = <BathComp />;
        background_color = "#e7a8cb";
        break;
      case "otc":
        color_name = "medication";
        message = "taking OTC medication";
        activity_icon = <PillComp />;
        background_color = "#c4cfe8";
        break;
      case "invalid":
        color_name = "secondary";
        message = "Invalid form value";
        activity_icon = <XComp />;
        background_color = "#d3d3d3";
        break;
      default:
        color_name = "vitals";
        message = value_type.replace("_", " ");
        activity_icon = <ActivityComp />;
        background_color = "#ECF8F8";
        break;
    }
    return { activity_icon, color_name, message, background_color };
  };

  const addData = async (obj) => {
    let isValid = true;

    // Toileting, Dressing, Showering
    let path = "/api/saveBinaryADL";
    let row = {
      timestamp: getISOString(),
      fk_resident_id: resident_id,
      adl_type: value_type,
      with_assistance: value_type !== "toileting" ? obj.withAssistance : false,
    };
    if (value_type === "eating") {
      path = "/api/saveEating";
      row = {
        start_time: getStartISOString(),
        end_time: getISOString(),
        fk_resident_id: resident_id,
        value: obj.value,
        with_assistance: obj.withAssistance,
      };
      if (obj.value === "") {
        isValid = false;
      }
    }
    if (value_type === "fluids") {
      path = "/api/saveFluids";
      row = {
        timestamp: getISOString(),
        fk_resident_id: resident_id,
        value: obj.value,
      };
      if (obj.value === "") {
        isValid = false;
      }
    }
    if (
      value_type === "glucose" ||
      value_type === "weight" ||
      value_type === "heart_rate"
    ) {
      path = "/api/saveVitals";
      row = {
        timestamp: getISOString(),
        fk_resident_id: resident_id,
        vital_type: value_type,
        value: obj.value,
      };
      if (obj.value === "") {
        isValid = false;
      }
    }
    if (value_type === "blood_pressure") {
      path = "/api/saveBloodPressure";
      row = {
        timestamp: getISOString(),
        fk_resident_id: resident_id,
        sys: obj.sys,
        dia: obj.dia,
      };
      if (obj.sys === "" || obj.dia === "") {
        isValid = false;
      }
    }
    if (value_type === "ambulation") {
      path = "/api/saveAmbulation";
      row = {
        start_time: getStartISOString(),
        end_time: getISOString(),
        fk_resident_id: resident_id,
        value: obj.value,
      };
      if (obj.value === "") {
        isValid = false;
      }
    }
    if (value_type === "otc") {
      path = "/api/saveTakingOTC";
      row = {
        timestamp: getISOString(),
        fk_otc_id: otc_options.filter((item) => item.value === obj.value)[0]
          .otc_id,
        fk_resident_id: resident_id,
      };
    }

    if (isValid) {
      fetch(path, {
        method: "POST",
        body: JSON.stringify(row),
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (res.ok) {
          console.log("ADL Saved");
        }

        // Send row up to update local copy
        addHelper(value_type, row);

        const { activity_icon, color_name, message, background_color } =
          getNotificationParams(value_type);
        showNotification({
          id: "addDataNotification",
          disallowClose: false,
          autoClose: 2500,
          title: "Data saved",
          message: "Recorded value for " + message,
          color: color_name,
          icon: activity_icon,
          loading: false,
          style: { backgroundColor: background_color },
          sx: { backgroundColor: background_color },
        });
      });
    } else {
      // Invalid form submission
      const { activity_icon, color_name, message, background_color } =
        getNotificationParams("invalid");
      showNotification({
        id: "addDataNotification",
        disallowClose: false,
        autoClose: 2500,
        title: "Invalid",
        message: message,
        color: color_name,
        icon: activity_icon,
        loading: false,
        style: { backgroundColor: background_color },
        sx: { backgroundColor: background_color },
      });
    }
    // Reset form
    addDataForm.reset();
    // Close the modal
    setOpened(false);

    // }
  };

  let content;
  if (
    value_type === "fluids" ||
    value_type === "glucose" ||
    value_type === "heart_rate" ||
    value_type === "weight"
  ) {
    let lbl;
    switch (value_type) {
      case "fluids":
        lbl = "Ounces";
        break;
      case "glucose":
        lbl = "mg/dL";
        break;
      case "heart_rate":
        lbl = "BPM";
        break;
      case "weight":
        lbl = "lBs";
        break;
      default:
        lbl = "";
        break;
    }

    content = (
      <Grid.Col span={6}>
        <NumberInput label={lbl} {...addDataForm.getInputProps("value")} />
      </Grid.Col>
    );
  }
  if (value_type === "blood_pressure") {
    content = (
      <Grid.Col span={6}>
        <Grid>
          <Grid.Col span={6}>
            <NumberInput label="Sys" {...addDataForm.getInputProps("sys")} />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput label="Dia" {...addDataForm.getInputProps("dia")} />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    );
  }
  if (value_type === "otc") {
    content = (
      <Grid.Col span={6}>
        <Autocomplete
          label="Medicine"
          placeholder="Select"
          data={otc_options}
          {...addDataForm.getInputProps("value")}
        />
      </Grid.Col>
    );
  }

  return (
    <Fragment>
      <Modal
        size="xl"
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Box sx={{ maxWidth: "80%" }} mx="auto">
          <form
            onSubmit={addDataForm.onSubmit((values) => {
              console.log("Submit the form:", values);
              addData(values);
            })}
          >
            <Title order={3} style={{ paddingBottom: "10px" }}>
              Enter {value_label} for {resident_name}:
            </Title>
            <Grid style={{ padding: "10px" }}>
              {value_type !== "eating" && value_type !== "ambulation" && (
                <div>
                  <Grid>
                    <Grid.Col span={2}>
                      <Select
                        label={"Timestamp"}
                        data={hour_options}
                        value={hour}
                        onChange={setHour}
                      />
                    </Grid.Col>
                    <Grid.Col span={2}>
                      <Select
                        sx={{ label: { color: "white" } }}
                        label={"."}
                        data={minute_options}
                        value={minute}
                        onChange={setMinute}
                      />
                    </Grid.Col>
                    <Grid.Col span={2}>
                      <Select
                        sx={{ label: { color: "white" } }}
                        label={"."}
                        data={["AM", "PM"]}
                        value={meridiem}
                        onChange={setMeridiem}
                      />
                    </Grid.Col>
                    {content}
                  </Grid>
                </div>
              )}
              {(value_type === "eating" || value_type === "ambulation") && (
                <Grid>
                  <Grid.Col span={2}>
                    <Select
                      label="Start Time"
                      data={hour_options}
                      value={startHour}
                      onChange={setStartHour}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Select
                      sx={{ label: { color: "white" } }}
                      label={"."}
                      data={minute_options}
                      value={startMinute}
                      onChange={setStartMinute}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Select
                      sx={{ label: { color: "white" } }}
                      label={"."}
                      data={["AM", "PM"]}
                      value={startMeridiem}
                      onChange={setStartMeridiem}
                    />
                  </Grid.Col>
                  {value_type === "eating" && (
                    <Grid.Col span={6}>
                      <NumberInput
                        label="Calories"
                        {...addDataForm.getInputProps("value")}
                      />
                    </Grid.Col>
                  )}
                  {value_type === "ambulation" && (
                    <Grid.Col span={6}>
                      <Select
                        label="Level"
                        data={["Light", "Moderate", "Vigorous"]}
                        {...addDataForm.getInputProps("value")}
                      />
                    </Grid.Col>
                  )}
                  <Grid.Col span={2}>
                    <Select
                      label="End Time"
                      data={hour_options}
                      value={hour}
                      onChange={setHour}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Select
                      sx={{ label: { color: "white" } }}
                      label={"."}
                      data={minute_options}
                      value={minute}
                      onChange={setMinute}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Select
                      sx={{ label: { color: "white" } }}
                      label={"."}
                      data={["AM", "PM"]}
                      value={meridiem}
                      onChange={setMeridiem}
                    />
                  </Grid.Col>
                </Grid>
              )}
            </Grid>

            <Group position="right" mt="md">
              {(value_type === "dressing" ||
                value_type === "eating" ||
                value_type === "showering") && (
                <Switch
                  label="With Assistance?"
                  checked={addDataForm.values.withAssistance}
                  {...addDataForm.getInputProps("withAssistance")}
                />
              )}
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Modal>
      <Button
        className="add_data_button"
        size="xs"
        radius="xl"
        uppercase
        onClick={() => openHelper()}
        leftIcon={<Plus size={18} />}
        color={button_color}
      />
    </Fragment>
  );
};

export default AddData;
