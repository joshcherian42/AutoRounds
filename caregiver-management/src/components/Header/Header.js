import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
// import Clock from "../Clock.js";
import useClock from "../Hooks/useClock";
import {
  TextInput,
  Textarea,
  Grid,
  Button,
  SegmentedControl,
  Box,
  Modal,
  useMantineTheme,
  Group,
  Select,
  Switch,
  Menu,
  Center,
  Affix,
  Transition,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import default_residents from "../../utils/default_residents";

const formatted_residents = default_residents.map((obj) => {
  return {
    value: obj.first_name + " " + obj.last_name,
    label: obj.first_name + " " + obj.last_name,
    image: "/images/people/" + obj.first_name + ".jpg",
  };
});

function Header({
  screenText,
  first_name,
  last_name,
  addHelper,
  editNoteState,
  editComplete,
  num_events,
  phaseHelper,
  phase,
  syncDate,
  clockCleanup,
}) {
  const theme = useMantineTheme();
  let location = useLocation();

  const [phaseText, setPhaseText] = useState("");
  const [opened, setOpened] = useState(false);
  const [fallOpened, setFallOpened] = useState(false);

  const { clockDate } = useClock(phase, syncDate, clockCleanup, true);

  const userSpecific = first_name !== "" && last_name !== "";
  const resident_name = userSpecific ? first_name + " " + last_name : "";

  const default_form = {
    residentName: resident_name,
    body: "",
    caregiverName: "",
    priority: "0",
    actionRequired: false,
  };

  const statusUpdate = useForm({
    initialValues: default_form,
    validate: {
      residentName: (value) => (value === "" ? "Must select a resident" : null),
    },
  });

  useEffect(() => {
    if (editNoteState.status) {
      // fetch("/api/loadNote", {
      //   method: "POST",
      //   body: JSON.stringify({ note_id: editNoteState.note.note_id }),
      //   headers: { "Content-Type": "application/json" },
      // }).then((res) => {
      //   if (res.ok) {
      //     res.json().then((data) => {
      //       const note = data[0];
      //       statusUpdate.setFieldValue(
      //         "residentName",
      //         note["resident_first_name"] + " " + note["resident_last_name"]
      //       );
      //       statusUpdate.setFieldValue("body", note["body"]);
      //       statusUpdate.setFieldValue("caregiverName", note["caregiver_name"]);
      //       statusUpdate.setFieldValue("priority", note["priority"]);
      //       statusUpdate.setFieldValue(
      //         "actionRequired",
      //         note["action_required"]
      //       );
      //     });
      //   }
      // });

      setOpened(true);
    } else {
      statusUpdate.setFieldValue("residentName", resident_name);
    }
  }, [editNoteState.status, editNoteState.note.note_id, resident_name]);

  const submitNote = async (obj) => {
    // Save note to database
    const _first_name = userSpecific
      ? first_name
      : obj.residentName.split(" ")[0];
    const _last_name = userSpecific
      ? last_name
      : obj.residentName.split(" ")[1];

    // const date = new Date();
    let note = {
      date: clockDate.toLocaleDateString(),
      time: clockDate.toLocaleTimeString(),
      resident_first_name: _first_name,
      resident_last_name: _last_name,
      caregiver_name: obj.caregiverName,
      body: obj.body,
      priority: obj.priority,
      action_required: obj.actionRequired,
    };

    // new Promise((resolve, reject) => {
    //   fetch("/api/saveNote", {
    //     method: "POST",
    //     body: JSON.stringify(note),
    //     headers: { "Content-Type": "application/json" },
    //   }).then((res) => {
    //     if (res.ok) {
    //       console.log("Note Saved");

    //       // Complete note data with note_id from database
    //       fetch("/api/getNoteByContent", {
    //         method: "POST",
    //         body: JSON.stringify(note),
    //         headers: { "Content-Type": "application/json" },
    //       }).then((res) => {
    //         if (res.ok) {
    //           res.json().then((data) => {
    //             resolve(data[0]);
    //           });
    //         }
    //       });
    //     }
    //   });
    // }).then((res) => {
    //   // Reset form
    //   statusUpdate.reset();

    //   // Send new note to parent to add to local map
    //   addHelper(res);

    //   // Close the modal
    //   setOpened(false);
    // });

    // Reset form
    statusUpdate.reset();

    // Send new note to parent to add to local map
    addHelper(note);

    // Close the modal
    setOpened(false);
  };

  const updateNote = (obj) => {
    //const date = new Date();
    const vals = {
      note_id: editNoteState.note.note_id,
      date: clockDate.toLocaleDateString(),
      time: clockDate.toLocaleTimeString(),
      caregiver_name: obj.caregiverName,
      body: obj.body,
      priority: obj.priority,
      action_required: obj.actionRequired,
    };

    // fetch("/api/updateNote", {
    //   method: "POST",
    //   body: JSON.stringify(vals),
    //   headers: { "Content-Type": "application/json" },
    // }).then((res) => {
    //   if (res.ok) {
    //     if (res.ok) {
    //       console.log("Note Updated");
    //     }
    //   }
    // });

    // Update the note locally
    const updated_note = {};
    for (const k in editNoteState.note) {
      updated_note[k] = editNoteState.note[k];
    }
    for (const k in vals) {
      updated_note[k] = vals[k];
    }

    // Reset form
    statusUpdate.reset();

    // Send updated note to parent
    addHelper(updated_note);
    editComplete();

    // Close the modal
    setOpened(false);
  };

  const fallOpenHelper = () => {
    setFallOpened(true);

    // const date = new Date();
    let note = {
      date: clockDate.toLocaleDateString(),
      time: clockDate.toLocaleTimeString(),
      resident_first_name: "Nick",
      resident_last_name: "Miller",
      caregiver_name: "Auto",
      body: "Nick Miller has fallen; check Map to find location",
      priority: "3",
      action_required: true,
      is_alert: true,
      note_id: "-11",
    };

    // const complete_note = new Promise((resolve, reject) => {
    //   fetch("/api/saveAlert", {
    //     method: "POST",
    //     body: JSON.stringify(note),
    //     headers: { "Content-Type": "application/json" },
    //   }).then((res) => {
    //     if (res.ok) {
    //       console.log("Fall Event Saved");

    //       // Complete note data
    //       fetch("/api/getNoteByContent", {
    //         method: "POST",
    //         body: JSON.stringify(note),
    //         headers: { "Content-Type": "application/json" },
    //       }).then((res) => {
    //         if (res.ok) {
    //           res.json().then((data) => {
    //             resolve(data[0]);
    //           });
    //         }
    //       });
    //     }
    //   });
    // });

    // complete_note.then((res) => {
    //   // Send new note to parent
    //   addHelper(res);
    // });

    addHelper(note);
  };

  return (
    <div
      style={{ color: theme.colors.font[0], fontFamily: theme.fontFamily }}
      className="header_container"
    >
      <Modal
        className="fall_modal"
        opened={fallOpened}
        onClose={() => setFallOpened(false)}
      >
        <div className="fall_alert_body">
          <div className="fall_alert">Fall Alert!</div>
          <div className="fall_alert_text">
            Nick Miller has fallen! His location is marked on the map.
          </div>
          <Center>
            <Link
              style={{ textDecoration: "none", height: "fit-content" }}
              to={"/map"}
            >
              <Button onClick={() => setFallOpened(false)} color="red">
                Go to Map
              </Button>
            </Link>
          </Center>
        </div>
      </Modal>

      <Modal
        opened={opened}
        onClose={() => {
          editComplete();
          setOpened(false);
        }}
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
            onSubmit={statusUpdate.onSubmit((values) => {
              if (!editNoteState.status) {
                submitNote(values);
              } else {
                updateNote(values);
              }
            })}
          >
            <Grid grow>
              <Grid.Col span={6}>
                <TextInput
                  sx={{ maxWidth: "100%", minWidth: "100px" }}
                  label="Caregiver Name"
                  placeholder=""
                  {...statusUpdate.getInputProps("caregiverName")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                {userSpecific && (
                  <TextInput
                    sx={{
                      maxWidth: "100%",
                      minWidth: "100px",
                      alignSelf: "right",
                    }}
                    label="Resident Name"
                    value={statusUpdate.values.residentName}
                    onChange={(event) =>
                      statusUpdate.setFieldValue(
                        "residentName",
                        event.currentTarget.value
                      )
                    }
                    disabled
                  />
                )}
                {!userSpecific && (
                  <Select
                    sx={{
                      maxWidth: "100%",
                      minWidth: "100px",
                      alignSelf: "right",
                    }}
                    label="Resident Name"
                    placeholder="Select Resident"
                    data={formatted_residents}
                    disabled={editNoteState.status}
                    required
                    {...statusUpdate.getInputProps("residentName")}
                  />
                )}
              </Grid.Col>
              <Grid.Col span={12}>
                <SegmentedControl
                  transitionDuration={500}
                  transitionTimingFunction="linear"
                  data={[
                    { label: "No Priority", value: "0" },
                    { label: "Low", value: "1" },
                    { label: "Medium", value: "2" },
                    { label: "High", value: "3" },
                  ]}
                  {...statusUpdate.getInputProps("priority")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  mt="sm"
                  label="Note"
                  placeholder=""
                  {...statusUpdate.getInputProps("body")}
                />
              </Grid.Col>
            </Grid>
            <Group position="right" mt="md">
              <Switch
                label="Action Required?"
                checked={statusUpdate.values.actionRequired}
                {...statusUpdate.getInputProps("actionRequired")}
              />
            </Group>
            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Modal>
      <div className="Title">
        <span style={{ color: theme.colors.accent[5] }}>
          AutoRounds Header
        </span>
        &nbsp; | &nbsp; {screenText}
      </div>
      <div className="right_header">
        <div className="phase_text">{phaseText}</div>
        <div className="clock">
          <p style={{ textAlign: "right" }}>
            {clockDate.toLocaleTimeString()}
            <br />
            {clockDate.toLocaleDateString()}
          </p>
        </div>
        <Button
          style={{ marginRight: "5%" }}
          onClick={() => {
            setOpened(true);
          }}
        >
          Add Note
        </Button>
        {location.pathname !== "/map" && (
          <Menu>
            <Menu.Item
              onClick={() => {
                phaseHelper(-1);
                setPhaseText("");
              }}
            >
              {" "}
              Default - Reset{" "}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                phaseHelper(0);
                setPhaseText("Phase 0");
              }}
            >
              {" "}
              Phase 0 - Interface{" "}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                phaseHelper(1);
                setPhaseText("Phase 1");
              }}
            >
              {" "}
              Phase 1 - Breakfast{" "}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                phaseHelper(2);
                setPhaseText("Phase 2");
              }}
            >
              {" "}
              Phase 2 - Rounds{" "}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                phaseHelper(3);
                setPhaseText("Phase 3");
              }}
            >
              {" "}
              Phase 3 - BP{" "}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                phaseHelper(4);
                setPhaseText("Phase 4");
                fallOpenHelper();
              }}
            >
              {" "}
              Phase 4 - Fall{" "}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                phaseHelper(5);
                setPhaseText("Phase 5");
              }}
            >
              {" "}
              Phase 5 - Doctor{" "}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                phaseHelper(6);
                setPhaseText("");
              }}
            >
              {" "}
              Phase 6{" "}
            </Menu.Item>
          </Menu>
        )}
        {location.pathname === "/map" && (
          <Menu>
            <Menu.Item>N/A</Menu.Item>
          </Menu>
        )}
      </div>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={num_events > 0 && location.pathname !== "/map"}>
          {(transitionStyles) => (
            <Link
              style={{ textDecoration: "none", height: "fit-content" }}
              to={"/map"}
            >
              <Button style={transitionStyles} color="red">
                Someone has fallen
              </Button>
            </Link>
          )}
        </Transition>
      </Affix>
    </div>
  );
}

export default Header;
