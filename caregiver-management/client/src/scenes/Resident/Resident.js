import React, { useState, useEffect } from "react";

import {
  Battery,
  Battery1,
  Battery2,
  Battery3,
  Battery4,
  BatteryOff,
} from "tabler-icons-react";

import { Image } from "@mantine/core";
import { useParams } from "react-router-dom";

import "./Resident.css";
import AccordionList from "../../components/GraphAccordion/AccordionList";
import default_adllist from "../../utils/default_adllist";
import default_vitalslist from "../../utils/default_vitalslist";

import NotesList from "../../components/Notes/NotesList";
import Summary from "../../components/Summary/Summary";
import useTracking from "../../components/Hooks/useTracking";

function Resident({
  dispatch,
  notesList,
  editSignal,
  deleteNote,
  resolveNote,
  phase,
  syncDate,
  clockCleanup,
}) {
  let params = useParams();

  const vitalsList = default_vitalslist;
  const ADLList = default_adllist;
  const [selectedView, setSelectedView] = useState("Summary");

  const {
    getOffset,
    getMedicationInfo,
    getAggData,
    otc_options,
    getData,
    getDayActivities,
    getLastVitalValue,
    finishedLoading,
    addDataHelper,
  } = useTracking(params.resident_id, syncDate);

  useEffect(() => {
    dispatch({
      type: "route",
      payload: {
        screenText: "Resident View",
        currentPage: "residents",
        first_name: params.first_name,
        last_name: params.last_name,
      },
    });
  }, [params.resident_id, dispatch, params.first_name, params.last_name]);

  function get_battery_icon(battery_status) {
    if (battery_status === 0) {
      return <Battery color={"#E52B2B"} />;
    } else if (battery_status <= 25) {
      return <Battery1 color={"#E52B2B"} />;
    } else if (battery_status <= 50) {
      return <Battery2 color={"#22B722"} />;
    } else if (battery_status <= 75) {
      return <Battery3 color={"#22B722"} />;
    } else if (battery_status <= 100) {
      return <Battery4 color={"#22B722"} />;
    } else {
      return <BatteryOff />;
    }
  }

  function changeSelectedView(sView) {
    setSelectedView(sView);
  }

  let viewContent;
  const notesListContent = (
    <div className="resident_notespage_view_container">
      <NotesList
        allNotes={notesList}
        userSpecific={{
          status: true,
          first_name: params.first_name,
          last_name: params.last_name,
        }}
        editSignal={editSignal}
        deleteNote={deleteNote}
        resolveNote={resolveNote}
      />
    </div>
  );
  const summaryContent = (
    <Summary
      resident_id={params.resident_id}
      first_name={params.first_name}
      last_name={params.last_name}
      getMedicationInfo={getMedicationInfo}
      getData={getData}
      getAggData={getAggData}
      getDayActivities={getDayActivities}
      getOffset={getOffset}
      getLastVitalValue={getLastVitalValue}
      otc_options={otc_options}
      finishedLoading={finishedLoading}
      phase={phase}
      syncDate={syncDate}
      clockCleanup={clockCleanup}
      addDataHelper={addDataHelper}
    />
  );

  const vitalsContent = (
    <AccordionList
      acc_list={vitalsList}
      getData={getData}
      getLastVitalValue={getLastVitalValue}
      resident_id={params.resident_id}
      first_name={params.first_name}
      last_name={params.last_name}
      otc_options={otc_options}
      finishedLoading={finishedLoading}
      addDataHelper={addDataHelper}
      phase={phase}
      syncDate={syncDate}
      clockCleanup={clockCleanup}
    />
  );

  const adlsContent = (
    <AccordionList
      acc_list={ADLList}
      getData={getData}
      getLastVitalValue={getLastVitalValue}
      resident_id={params.resident_id}
      first_name={params.first_name}
      last_name={params.last_name}
      otc_options={otc_options}
      finishedLoading={finishedLoading}
      addDataHelper={addDataHelper}
      phase={phase}
      syncDate={syncDate}
      clockCleanup={clockCleanup}
    />
  );

  if (selectedView === "Vitals") {
    viewContent = vitalsContent;
  }
  if (selectedView === "ADLs") {
    viewContent = adlsContent;
  }
  if (selectedView === "Notes") {
    viewContent = notesListContent;
  }
  if (selectedView === "Summary") {
    viewContent = summaryContent;
  }

  const changeViewOptions = ["Summary", "Vitals", "ADLs", "Notes"].map(
    (val) => {
      return (
        <div
          key={val}
          className={
            selectedView === val
              ? "resident_view_options active"
              : "resident_view_options"
          }
          onClick={() => changeSelectedView(val)}
        >
          {val}
        </div>
      );
    }
  );

  return (
    <div>
      <div className="home_container">
        <div className="resident_view_container">
          <div className="resident_sidebar">
            <div className="resident_top_sidebar">
              <Image
                style={{ paddingTop: "20%" }}
                src={`/images/people/${params.first_name}.jpg`}
                height={"18vh"}
                width={"13vw"}
                alt={params.first_name}
              />
              <div className="resident_view_name">
                {params.first_name} {params.last_name}
              </div>
              <div className="resident_view_age"> {params.age} years old</div>
              <div className="resident_view_room">
                <span style={{ fontSize: "medium", fontWeight: "400" }}>
                  Room:
                </span>{" "}
                {params.room}
              </div>
              <div className="resident_view_location">
                <span style={{ fontSize: "medium", fontWeight: "400" }}>
                  Current Location:
                </span>{" "}
                {params.location}
              </div>
              <div className="resident_view_battery">
                {get_battery_icon(Number(params.battery))}
              </div>
            </div>
            <div>{changeViewOptions}</div>
          </div>
          <div className="resident_information">{viewContent}</div>
        </div>
      </div>
    </div>
  );
}

export default Resident;
