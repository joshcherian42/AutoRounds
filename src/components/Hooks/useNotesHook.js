import { useState, useRef, useReducer } from "react";
import fake_notes from "../../utils/fake_notes";

const initialState = {
  note: {},
  status: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "signal":
      return { note: action.payload, status: true };
    case "complete":
      return { note: {}, status: false };
    default:
      return state;
  }
};

const useNotesHook = () => {
  const notesMap = useRef(new Map());
  const [notesList, setNotesList] = useState([]);
  const [editMode, editDispatch] = useReducer(reducer, initialState);
  const [numActions, setNumActions] = useState(0);
  const [numEvents, setNumEvents] = useState(0);

  const updateNotesState = () => {
    setNotesList([...notesMap.current.values()]);
    setNumActions(
      [...notesMap.current.values()].filter((note) => note.action_required)
        .length
    );
    setNumEvents(
      [...notesMap.current.values()].filter((note) => note.is_alert).length
    );
  };

  const addNote = (note) => {
    const complete_note = {
      ...note,
      note_id: notesMap.current.size + 1,
      user_entered: true,
    };
    notesMap.current.set(complete_note.note_id, complete_note);
    updateNotesState();
  };

  const editSignal = (note) => {
    editDispatch({ type: "signal", payload: note });
  };
  const editComplete = () => {
    editDispatch({ type: "complete" });
  };

  const resolveNote = (note_id) => {
    // Resolve note in database and local map

    const note = notesMap.current.get(note_id);
    note["resolved"] = true;
    note["action_required"] = false;
    notesMap.current.set(note_id, note);
    updateNotesState();
  };

  const deleteNote = (note_id) => {
    // Delete in database and local map
    notesMap.current.delete(note_id);
    updateNotesState();
  };

  const changePhase = (phase, syncDate) => {
    // Delete auto-generated notes in local map

    if (phase === -1) {
      // Reset
      notesMap.current.clear();
    }
    const auto_ids = notesList
      .filter((note) => note.is_alert)
      .map((note) => note.note_id);
    auto_ids.forEach((note_id) => notesMap.current.delete(note_id));

    // Date object is YYYY-MM-DD, locale string displays as MM/DD/YYYY
    const final_date = syncDate.split("T")[0];
    const current_day =
      (final_date.split("-")[1].charAt(0) === "0"
        ? final_date.split("-")[1].charAt(1)
        : final_date.split("-")[1]) +
      "/" +
      final_date.split("-")[2] +
      "/" +
      final_date.split("-")[0];

    const yesterday =
      current_day.split("/")[0] +
      "/" +
      (parseInt(current_day.split("/")[1]) - 1).toString() +
      "/" +
      current_day.split("/")[2];

    // Add new notes for this phase
    let note_set = [];
    let resolve_set = [];
    switch (phase) {
      case 0:
        note_set = [
          {
            note_id: "-41",
            date: current_day,
            action_required: false,
            resolved: false,
          },
        ];
        break;
      case 1:
        note_set = [
          {
            note_id: "-1",
            date: current_day,
            action_required: true,
            resolved: false,
          },
          {
            note_id: "-2",
            date: yesterday,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-3",
            date: yesterday,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-4",
            date: yesterday,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-5",
            date: yesterday,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-6",
            date: yesterday,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-7",
            date: yesterday,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-8",
            date: yesterday,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-10",
            date: yesterday,
            action_required: false,
            resolved: false,
          },
        ];
        break;
      case 2:
        note_set = [
          {
            note_id: "-9",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-12",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-13",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-14",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-15",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-16",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-17",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-18",
            date: current_day,
            action_required: true,
            resolved: false,
          },
          {
            note_id: "-19",
            date: current_day,
            action_required: false,
            resolved: false,
          },
        ];
        resolve_set = [
          {
            note_id: "-2",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-4",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-6",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-8",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-10",
            date: current_day,
            action_required: false,
            resolved: true,
          },
        ];
        break;
      case 3:
        note_set = [
          {
            note_id: "-20",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-21",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-22",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-23",
            date: current_day,
            action_required: false,
            resolved: false,
          },
        ];
        resolve_set = [
          {
            note_id: "-12",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-13",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-14",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-15",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-17",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-18",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-19",
            date: current_day,
            action_required: false,
            resolved: true,
          },
        ];
        break;
      case 4:
        // No new notes between dinner and evening
        resolve_set = [
          {
            note_id: "-20",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-21",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-22",
            date: current_day,
            action_required: false,
            resolved: true,
          },
          {
            note_id: "-23",
            date: current_day,
            action_required: false,
            resolved: true,
          },
        ];
        break;
      case 5:
        note_set = [
          {
            note_id: "-40",
            date: current_day,
            action_required: true,
            resolved: false,
          },
        ];
        resolve_set = [
          {
            note_id: "-1",
            date: yesterday,
            action_required: false,
            resolved: true,
          },
        ];
        break;
      case 6:
        note_set = [
          {
            note_id: "-18",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-41",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-4",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-40",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-16",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-17",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-18",
            date: current_day,
            action_required: true,
            resolved: false,
          },
          {
            note_id: "-19",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-20",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-21",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-22",
            date: current_day,
            action_required: false,
            resolved: false,
          },
          {
            note_id: "-23",
            date: current_day,
            action_required: false,
            resolved: false,
          },
        ];
        resolve_set = [];
        break;
      default:
        break;
    }
    note_set.forEach((ele) => {
      notesMap.current.set(ele.note_id, {
        ...fake_notes[ele.note_id],
        ...ele,
      });
    });
    resolve_set.forEach((ele) => {
      if (notesMap.current.has(ele.note_id)) {
        notesMap.current.set(ele.note_id, {
          ...fake_notes[ele.note_id],
          ...ele,
        });
      }
    });
    updateNotesState();
  };

  return {
    notesList,
    addNote,
    editMode,
    editSignal,
    editComplete,
    deleteNote,
    resolveNote,
    numActions,
    numEvents,
    changePhase,
  };
};

export default useNotesHook;
