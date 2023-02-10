import React, { useState, useEffect } from "react";
import "../../scenes/NotesPage/NotesPage.css";
import useSortHook from "../Hooks/useSortHook";
import { Urgent } from "tabler-icons-react";

import { useMantineTheme, Table, Text, Button } from "@mantine/core";

const formatPriority = (val) => {
  if (val === "0" || val === 0) {
    return "-";
  }
  if (val === "1" || val === 1) {
    return "Low";
  }
  if (val === "2" || val === 2) {
    return "Med";
  }
  if (val === "3" || val === 3) {
    return "High";
  }
  return "NA";
};

const NotesList = ({
  allNotes,
  userSpecific,
  editSignal,
  deleteNote,
  resolveNote,
}) => {
  const theme = useMantineTheme();

  const [notesList, setNotesList] = useState([]);
  const [width, setWidth] = React.useState(window.innerWidth);

  const { sortIcon, dynamicSortHelper } = useSortHook({
    default_column: "priority",
  });

  useEffect(() => {
    if (userSpecific.status) {
      setNotesList(
        allNotes.filter(
          (ele) =>
            ele.resident_first_name === userSpecific.first_name &&
            ele.resident_last_name === userSpecific.last_name
        )
      );
    } else {
      setNotesList(allNotes);
    }
  }, [allNotes, userSpecific]);

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  const booleanSort = (property, trueLast) => {
    // Sort boolean properties; trueLast puts true at the bottom
    return function (a, b) {
      if (a[property] === true && b[property] === false) {
        return trueLast ? 1 : -1;
      } else if (a[property] === false && b[property] === true) {
        return trueLast ? -1 : 1;
      }
      return 0;
    };
  };

  return (
    <div className="notes_list">
      <Table verticalSpacing="md" fontSize="sm" style={{ height: "76vh" }}>
        <thead>
          <tr style={{ backgroundColor: theme.colors.accent[5] }}>
            <th style={{ width: "3%" }}></th>
            <th style={{ width: "6%" }}>Priority {sortIcon("priority")}</th>
            {userSpecific.status === false && (
              <th style={{ width: "10%" }}>
                Resident Name {sortIcon("resident_last_name")}
              </th>
            )}
            <th></th>
            <th style={{ width: "10%" }}>Date {sortIcon("date")}</th>
            <th style={{ width: width > 1550 ? "18%" : "13%" }}></th>
          </tr>
        </thead>
        <tbody>
          {notesList
            .slice(0)
            .sort(dynamicSortHelper())
            .sort(booleanSort("action_required", false))
            .sort(booleanSort("resolved", true))
            .sort(booleanSort("is_alert"), false)
            .map((note) => (
              <tr key={note.id} className={note.resolved ? "resolved" : ""}>
                <td style={{ width: "3%" }}>
                  {note.action_required && <Urgent color="#FF635F" />}
                </td>
                <td style={{ width: "6%", fontWeight: "400" }}>
                  {formatPriority(note.priority)}
                </td>

                {userSpecific.status === false && (
                  <td style={{ width: "10%" }}>
                    <Text
                      size="lg"
                      weight={700}
                      style={{ paddingRight: "5%", alignSelf: "center" }}
                    >
                      {note.resident_first_name} {note.resident_last_name}
                    </Text>
                  </td>
                )}

                <td>
                  <Text><span style={{fontWeight:'bold'}}>{note.caregiver_name}: </span>{note.body}</Text>
                </td>
                <td style={{ width: "10%" }}>
                  <div className="note_date_time">
                    <Text>{note.date}</Text>
                    <Text>{note.time}</Text>
                  </div>
                </td>
                <td
                  style={{
                    width: width > 1550 ? "17%" : "13%",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: width > 1550 ? "row" : "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {!note.resolved && (
                      <Button
                        style={{ margin: "5% 0" }}
                        key={"edit_" + note.note_id}
                        onClick={() => {
                          editSignal(note);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      color={!note.resolved ? theme.colors.accent[9] : "gray"}
                      style={{ margin: "5% 0" }}
                      key={"resolve_" + note.note_id}
                      onClick={() => {
                        if (note.is_alert) {
                          deleteNote(note.note_id);
                        } else {
                          if (!note.resolved) {
                            resolveNote(note.note_id);
                          } else {
                            deleteNote(note.note_id);
                          }
                        }
                      }}
                    >
                      {note.is_alert
                        ? "Delete"
                        : !note.resolved
                        ? "Resolve"
                        : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default NotesList;
