import React, { useReducer } from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import useNotesHook from "./components/Hooks/useNotesHook";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

import Resident from "./scenes/Resident/Resident";
import Map from "./scenes/Map/Map";
import NotesPage from "./scenes/NotesPage/NotesPage";
import LoadPage from "./scenes/LoadPage/LoadPage";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { addLeadingZero } from "./utils/formatISOString";
import default_residents from "./utils/default_residents";
import resident_locations from "./utils/resident_locations";
import reset_query from "./utils/queries/reset_database";

const createISOString = (final_date, h, m, s) => {
  const temp =
    final_date +
    "T" +
    addLeadingZero(h) +
    ":" +
    addLeadingZero(m) +
    ":" +
    addLeadingZero(s);
  return temp;
};

const getResidentStatus = (arr, phase) => {
  let _phase = phase <= 6 ? phase : 6;
  const updated_arr = arr.map((resident) => {
    const obj = { ...resident };
    obj.location = resident_locations[_phase.toString()][resident.first_name];
    return obj;
  });
  return updated_arr;
};

const initialState = {
  screenText: "",
  currentPage: "",

  first_name: "",
  last_name: "",

  phase: 0,
  final_date: "2022-06-29",
  syncDate: new Date(),

  restart_animation: true,
  animation_status: [],

  residents_list: getResidentStatus(default_residents, 0),
};

const getSyncDate = (phase) => {
  const date = new Date();
  let final_date = "2022-06-29";
  if (phase === 5) {
    final_date = "2022-06-30";
  }
  if (phase === 6) {
    final_date = "2022-06-28";
  }
  let syncDate;
  switch (phase) {
    case 0:
      syncDate = createISOString(final_date, 23, 59, 0);
      break;
    case 1:
      syncDate = createISOString(final_date, 7, 55, 0);
      break;
    case 2:
      syncDate = createISOString(final_date, 10, 15, 0);
      break;
    case 3:
      syncDate = createISOString(final_date, 17, 45, 0);
      break;
    case 4:
      syncDate = createISOString(final_date, 22, 20, 0);
      break;
    case 5:
      syncDate = createISOString(final_date, 7, 30, 0);
      break;
    case 6:
      syncDate = createISOString(final_date, 23, 59, 0);
      break;
    default:
      syncDate = createISOString(
        final_date,
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      );
      break;
  }
  return { final_date, syncDate };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "route":
      return {
        ...state,
        screenText: action.payload.screenText,
        currentPage: action.payload.currentPage,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
      };
    case "phase":
      const { final_date, syncDate } = getSyncDate(action.payload.phase);
      const updated_residents = getResidentStatus(
        state.residents_list,
        action.payload.phase
      );
      return {
        ...state,
        phase: action.payload.phase,
        final_date: final_date,
        syncDate: syncDate,
        restart_animation: true,
        animation_status: [],
        residents_list: updated_residents,
      };
    case "syncTime":
      const val = action.payload.syncDate;
      return {
        ...state,
        syncDate: createISOString(
          state.final_date,
          val.getHours(),
          val.getMinutes(),
          val.getSeconds()
        ),
      };
    case "animationCleanup":
      return {
        ...state,
        restart_animation: false,
        animation_status: action.payload.status.map((val) => {
          return { index: val.index, pos: val.pos };
        }),
      };
    default:
      return state;
  }
};

const mantinePalette = {
  // 'accent': ['#40A6AA'],
  accent: [
    "#ECF8F8",
    "#CBEAEB",
    "#AADDDF",
    "#88D0D2",
    "#67C2C6",
    "#46B5B9",
    "#389194",
    "#2A6D6F",
    "#1C484A",
    "#0E2425",
  ],
  secondary: [
    "#FFF1E5",
    "#FFD9B8",
    "#FFC08A",
    "#FFA75C",
    "#FF8F2E",
    "#FF7600",
    "#CC5E00",
    "#994700",
    "#662F00",
    "#331800",
  ],
  dressing: [
    "#ffcb5f", // fff1d5
    "#ffebc1",
    "#ffe5ad",
    "#ffde9a",
    "#ffd886",
    "#ffd173",
    "#ffcb5f",
    "#ffc54b",
    "#ffbe38",
    "#ffb824",
  ],
  eating: [
    "#4BC953", // a6e4aa
    "#96e09b",
    "#87db8d",
    "#78d77e",
    "#69d270",
    "#5ace61",
    "#4BC953",
    "#3cc445",
    "#37b63f",
    "#32a73a",
  ],
  fluids: [
    "#FFA95F", // ffe8d5
    "#ffdec1",
    "#ffd3ad",
    "#ffc99a",
    "#ffbe86",
    "#ffb473",
    "#FFA95F",
    "#ff9e4b",
    "#ff9438",
    "#ff8924",
  ],
  physical: [
    "#FF635F", // ffd6d5
    "#ffc3c1",
    "#ffb0ad",
    "#ff9c9a",
    "#ff8986",
    "#ff7673",
    "#FF635F",
    "#ff504b",
    "#ff3d38",
    "#ff2a24",
  ],
  medication: [
    "#708ac6", // c4cfe8
    "#b6c3e2",
    "#a8b8dc",
    "#9aacd7",
    "#8ca1d1",
    "#7e95cc",
    "#708ac6",
    "#627fc0",
    "#5473bb",
    "#4868b4",
  ],
  showering: [
    "#CD4C95", // e7a8cb
    "#e299c2",
    "#de89b9",
    "#da7ab0",
    "#d66ba7",
    "#d15b9e",
    "#CD4C95",
    "#c93d8c",
    "#bd3582",
    "#ae3177",
  ],
  toileting: [
    "#8670C9", // cec5e9
    "#c2b7e4",
    "#b6a9df",
    "#aa9bd9",
    "#9e8cd4",
    "#927ece",
    "#8670C9",
    "#7a62c4",
    "#6e54be",
    "#6246b8",
  ],
  taken: [
    "#769ecb",
    "#6894c6",
    "#5a8ac1",
    "#4c80bb",
    "#4376b0",
    "#3d6da2",
    "#386394",
    "#335986",
    "#2d5078",
    "#284669",
  ],
  untaken: [
    "#8db4b5",
    "#81acad",
    "#75a5a6",
    "#699d9e",
    "#5f9394",
    "#588788",
    "#507b7c",
    "#486f70",
    "#416364",
    "#395858",
  ],
  font: ["#2b2b2b"],
};

export default function Index() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
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
  } = useNotesHook();

  const phaseHelper = (val) => {
    dispatch({ type: "phase", payload: { phase: val } });
    changePhase(val, getSyncDate(val).syncDate);
    if (val === -1) {
      fetch("/api/runQuery", {
        method: "POST",
        body: JSON.stringify({ query: reset_query }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (res.ok) {
          console.log("Added data");
        }
      });
    }
  };

  const animationCleanup = (status) => {
    dispatch({ type: "animationCleanup", payload: { status } });
  };

  const clockHelper = (syncDate) => {
    dispatch({ type: "syncTime", payload: { syncDate } });
  };

  return (
    <MantineProvider
      theme={{
        fontFamily: "Segoe UI",
        colors: mantinePalette,
        primaryColor: "accent",
      }}
    >
      <NotificationsProvider position="top-center">
        <BrowserRouter>
          <div>
            <Header
              screenText={state.screenText}
              editNoteState={editMode}
              editComplete={editComplete}
              addHelper={addNote}
              first_name={state.first_name}
              last_name={state.last_name}
              num_events={numEvents}
              phaseHelper={phaseHelper}
              phase={state.phase}
              syncDate={state.syncDate}
              clockCleanup={clockHelper}
            />
            <div className="page_container">
              <Sidebar page={state.currentPage} numActions={numActions} />
              <Routes>
                <Route
                  path="/"
                  element={
                    <App
                      dispatch={dispatch}
                      default_residents={state.residents_list}
                    />
                  }
                />
                <Route
                  path="resident"
                  element={
                    <Resident
                      dispatch={dispatch}
                      notesList={notesList}
                      editSignal={editSignal}
                      deleteNote={deleteNote}
                      resolveNote={resolveNote}
                      final_date={state.final_date}
                      phase={state.phase}
                      syncDate={state.syncDate}
                      clockCleanup={clockHelper}
                    />
                  }
                >
                  <Route
                    path=":first_name/:last_name/:resident_id/:room/:location/:age/:battery"
                    element={
                      <Resident
                        dispatch={dispatch}
                        notesList={notesList}
                        editSignal={editSignal}
                        deleteNote={deleteNote}
                        resolveNote={resolveNote}
                        final_date={state.final_date}
                        phase={state.phase}
                        syncDate={state.syncDate}
                        clockCleanup={clockHelper}
                      />
                    }
                  />
                </Route>
                <Route
                  path="map"
                  element={
                    <Map
                      dispatch={dispatch}
                      phase={state.phase}
                      restart_animation={state.restart_animation}
                      animation_status={state.animation_status}
                      cleanup={animationCleanup}
                      default_residents={state.residents_list}
                    />
                  }
                />
                <Route
                  path="notes"
                  element={
                    <NotesPage
                      dispatch={dispatch}
                      notesList={notesList}
                      editSignal={editSignal}
                      deleteNote={deleteNote}
                      resolveNote={resolveNote}
                    />
                  }
                />
                <Route path="/dev" element={<LoadPage />} />
                <Route
                  path="*"
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>There's nothing here!</p>
                    </main>
                  }
                />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Index />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
