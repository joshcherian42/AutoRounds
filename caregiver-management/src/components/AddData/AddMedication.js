import { Fragment, useState } from "react";
import {
  TextInput,
  Grid,
  Button,
  Box,
  Modal,
  useMantineTheme,
  Group,
  Select,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import useTimestamp from "../Hooks/useTimestamp";

const AddMedication = ({
  resident_name,
  prescription_id,
  prescription_name,
  color,
  button_text,
  phase,
  syncDate,
  clockCleanup,
}) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [buttonText, setButtonText] = useState(button_text);
  const [buttonColor, setButtonColor] = useState(color);

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

  const openHelper = () => {
    if (buttonColor === "accent") {
      setOpened(true);
      updateTime();
    }
  };

  const default_form = {
    residentName: resident_name,
    prescriptionNumber: prescription_id,
    prescriptionName: prescription_name,
  };

  const addDataForm = useForm({
    initialValues: default_form,
  });

  const addData = async (obj) => {
    let row = {
      timestamp: getISOString(),
      fk_prescription_id: prescription_id,
    };
    let path = "/api/saveTakingMedication";

    fetch(path, {
      method: "POST",
      body: JSON.stringify(row),
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (res.ok) {
        console.log("Taking Medication Saved");
      }
      // Reset form
      addDataForm.reset();

      // Close the modal
      setOpened(false);

      // Update the button
      setButtonColor("taken");
      setButtonText("Taken at " + hour + ":" + minute + meridiem.toLowerCase());
    });
  };

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
            <Grid grow>
              <Grid.Col span={6}>
                <TextInput
                  sx={{
                    maxWidth: "100%",
                    minWidth: "100px",
                    alignSelf: "right",
                  }}
                  label="Resident Name"
                  placeholder="John Johnson"
                  disabled
                  {...addDataForm.getInputProps("residentName")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  sx={{
                    maxWidth: "100%",
                    minWidth: "100px",
                    alignSelf: "right",
                  }}
                  label="Prescription Name"
                  placeholder={prescription_name}
                  disabled
                  {...addDataForm.getInputProps("prescriptionName")}
                />
              </Grid.Col>
              <Grid>
                <Grid.Col span={2} offset={6}>
                  <Select
                    label="Timestamp"
                    data={hour_options}
                    value={hour}
                    onChange={setHour}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <Select
                    label=" "
                    data={minute_options}
                    value={minute}
                    onChange={setMinute}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <Select
                    label=" "
                    data={["AM", "PM"]}
                    value={meridiem}
                    onChange={setMeridiem}
                  />
                </Grid.Col>
              </Grid>
            </Grid>
            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Modal>
      <Center>
        <Button
          onClick={openHelper}
          color={buttonColor}
          size="sm"
          compact
          fullWidth
        >
          {buttonText}
        </Button>
      </Center>
    </Fragment>
  );
};

export default AddMedication;
