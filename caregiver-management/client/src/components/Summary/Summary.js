import Hanger from "./svgs/hanger.svg";
import Pill from "./svgs/pill.svg";
import ToiletPaper from "./svgs/toilet-paper.svg";
import ToolsKitchen2 from "./svgs/tools-kitchen-2.svg";
import GlassFull from "./svgs/glass-full.svg";
import Walk from "./svgs/walk.svg";
import Bath from "./svgs/bath.svg";
import QuestionMark from "./svgs/question-mark.svg";

import { ReactComponent as HangerComp } from "./svgs/hanger.svg";
import { ReactComponent as PillComp } from "./svgs/pill.svg";
import { ReactComponent as ToiletPaperComp } from "./svgs/toilet-paper.svg";
import { ReactComponent as ToolsKitchen2Comp } from "./svgs/tools-kitchen-2.svg";
import { ReactComponent as GlassFullComp } from "./svgs/glass-full.svg";
import { ReactComponent as WalkComp } from "./svgs/walk.svg";
import { ReactComponent as BathComp } from "./svgs/bath.svg";
import { ReactComponent as QuestionMarkComp } from "./svgs/question-mark.svg";

import { useRef, useEffect } from "react";
import paper from "paper";
import AddData from "../AddData/AddData";
import { LoadingOverlay, useMantineTheme, Avatar } from "@mantine/core";

import default_residents from "../../utils/default_residents";
import default_adllist from "../../utils/default_adllist";
import default_vitalslist from "../../utils/default_vitalslist";
import MedicationContent from "./MedicationContent";

const Summary = ({
  resident_id,
  first_name,
  last_name,
  getOffset,
  getMedicationInfo,
  getAggData,
  otc_options,
  getData,
  getDayActivities,
  getLastVitalValue,
  finishedLoading,
  phase,
  syncDate,
  clockCleanup,
  addDataHelper,
}) => {
  const canvasRef = useRef();
  const theme = useMantineTheme();

  const final_date = syncDate.split("T")[0];

  const { aggBathroomData, aggEatingData, aggFluidData, aggPhysicalData } =
    getAggData();

  let dayActivities = getDayActivities();
  const getActivity = (activity) => {
    let activity_icon;
    let pill_color;
    switch (activity) {
      case "Dressing":
        activity_icon = Hanger;
        pill_color = theme.colors.dressing[6];
        break;
      case "Eating":
        activity_icon = ToolsKitchen2;
        pill_color = theme.colors.eating[6];
        break;
      case "Fluid Intake":
        activity_icon = GlassFull;
        pill_color = theme.colors.fluids[6];
        break;
      case "Physical Activity":
        activity_icon = Walk;
        pill_color = theme.colors.physical[6];
        break;
      case "Toileting":
        activity_icon = ToiletPaper;
        pill_color = theme.colors.toileting[6];
        break;
      case "Showering/Bathing":
        activity_icon = Bath;
        pill_color = theme.colors.showering[6];
        break;
      case "Medication Intake":
        activity_icon = Pill;
        pill_color = theme.colors.medication[6];
        break;
      default:
        activity_icon = QuestionMark;
        pill_color = "#4BC953";
        break;
    }
    return [activity_icon, pill_color];
  };

  const getAvatar = (activity) => {
    let activity_icon;
    let color_name;
    switch (activity) {
      case "Dressing":
        color_name = "dressing";
        activity_icon = <HangerComp />;
        break;
      case "Eating":
        color_name = "eating";
        activity_icon = <ToolsKitchen2Comp />;
        break;
      case "Fluid Intake":
        color_name = "fluids";
        activity_icon = <GlassFullComp />;
        break;
      case "Physical Activity":
        color_name = "physical";
        activity_icon = <WalkComp />;
        break;
      case "Toileting":
        color_name = "toileting";
        activity_icon = <ToiletPaperComp />;
        break;
      case "Showering/Bathing":
        color_name = "showering";
        activity_icon = <BathComp />;
        break;
      case "Medication Intake":
        color_name = "medication";
        activity_icon = <PillComp />;
        break;
      default:
        color_name = "eating";
        activity_icon = <QuestionMarkComp />;
        break;
    }
    return (
      <Avatar
        radius="md"
        style={{
          height: "4vh",
          width: "5vh",
          marginRight: "1vw",
        }}
        color={color_name}
      >
        {activity_icon}
      </Avatar>
    );
  };

  useEffect(() => {
    paper.setup(canvasRef.current);

    const canvasHeight = paper.view.size.height;
    const x_offset = 15;

    let i = 6;
    while (i < 24) {
      new paper.Path.Line({
        from: new paper.Point((i - 6) * 50 + x_offset, 25),
        to: new paper.Point((i - 6) * 50 + x_offset, canvasHeight - 25),
        strokeColor: "#b2b2b2",
        strokeWidth: "1",
      });
      var text = new paper.PointText(
        new paper.Point((i - 6) * 50 + x_offset, 20)
      );
      text.justification = "center";
      text.fillColor = "#b2b2b2";
      if (i < 12) {
        text.content = i + " AM";
      } else if (i === 12) {
        text.content = i + " PM";
      } else {
        let hour = i - 12;
        text.content = hour + " PM";
      }

      i += 1;
    }

    const pill_size = 80;
    let paper_objects = [];
    let bottom_rights = [];
    dayActivities.forEach(function (item, a) {
      let top_left_x = item.offset + x_offset - pill_size / 4;
      let top_left_y = 30;
      let bottom_right_x;
      if (Object.keys(item).includes("end_time")) {
        let offset = getOffset(item, "end_time");
        bottom_right_x = offset + pill_size / 2 + x_offset - pill_size / 4;
      } else {
        bottom_right_x = top_left_x + pill_size / 2;
      }

      let bottom_right_y = 30 + pill_size / 2;

      let overlap = true;
      while (overlap == true) {
        overlap = false;
        paper_objects.forEach(function (d, i) {
          let object_top_left_x = d.position._x - pill_size / 2;
          let object_top_left_y = d.position._y - pill_size / 4;
          let object_bottom_right_x;
          object_bottom_right_x = bottom_rights[i];

          if (
            ((top_left_x >= object_top_left_x &&
              top_left_x <= object_bottom_right_x) ||
              (bottom_right_x >= object_top_left_x &&
                bottom_right_x <= object_bottom_right_x)) &&
            top_left_y >= object_top_left_y &&
            top_left_y <= object_top_left_y + pill_size / 2
          ) {
            top_left_y += 45;
            bottom_right_y += 45;
            overlap = true;
          }
        });
      }

      const [activity_icon, pill_color] = getActivity(item.activity);

      let pill = new paper.Path.Rectangle({
        topLeft: new paper.Point(top_left_x, top_left_y),
        bottomRight: new paper.Point(bottom_right_x, bottom_right_y),
        radius: 20,
        fillColor: pill_color,
      });
      bottom_rights.push(bottom_right_x);
      paper_objects.push(pill);

      let timeline_icon = new paper.Path();
      paper.project.importSVG(activity_icon, (item, svg) => {
        timeline_icon = item;
        timeline_icon.position = pill.position;
      });
    });
    paper.view.update();
  }, [dayActivities]);

  function common_locations() {
    let locations;
    default_residents.forEach(function (r) {
      if (r.first_name === first_name && r.last_name === last_name) {
        locations = (
          <div key={r.first_name + " " + r.last_name}>
            {r.common_locations.map((item, ind) => (
              <div className="location_container" key={ind}>
                <div className="location_room"> {item[0]} </div>
                <div className="test_bar"></div>
                <div className="location_times">
                  {item[1]} - {item[2]}
                </div>
              </div>
            ))}
          </div>
        );
      }
    });
    return locations;
  }

  function aggDataHelper(adl_type) {
    switch (adl_type) {
      case "Toileting":
        return aggBathroomData;
      case "Eating":
        return aggEatingData;
      case "Fluid Intake":
        return aggFluidData;
      default:
        return "";
    }
  }

  function getPhysicalLastValue(exercise_type) {
    let last_day = Object.keys(
      aggPhysicalData.current[aggPhysicalData.current.length - 1]
    );
    let hasData = last_day[0] === final_date;
    let value = hasData
      ? aggPhysicalData.current[aggPhysicalData.current.length - 1][last_day][
          exercise_type
        ]
      : 0;

    return (
      <div>
        {value}
        &nbsp; minutes
      </div>
    );
  }

  function getLastDay(adl_type) {
    let adl_data = getData(adl_type, false);
    let agg_data = aggDataHelper(adl_type);

    if (adl_data.current.length !== 0) {
      let keys = Object.keys(adl_data.current[adl_data.current.length - 1]);
      let value = "";
      let last_day = keys.includes("timestamp")
        ? adl_data.current[adl_data.current.length - 1]["timestamp"]
        : adl_data.current[adl_data.current.length - 1]["end_time"];
      let hasData = last_day.split("T")[0] === final_date;

      let units;
      let agg_keys;
      if (agg_data !== "") {
        agg_keys = Object.keys(agg_data.current[agg_data.current.length - 1]);

        if (hasData) {
          value = agg_data.current[agg_data.current.length - 1][agg_keys[0]];
        } else {
          value = 0;
        }
        switch (adl_type) {
          case "Toileting":
            value === 1 ? (units = "time") : (units = "times");
            break;
          case "Eating":
            units = "Cal.";
            break;
          case "Fluid Intake":
            units = "Oz.";
            break;
          default:
            break;
        }
      }

      if (value !== "") {
        return (
          <div className="adl_date_value">
            <div>
              {value} {units}
            </div>
            {hasData && (
              <div style={{ fontSize: "medium" }}>
                {new Date(last_day).toLocaleTimeString()}
              </div>
            )}
          </div>
        );
      } else {
        if (hasData) {
          return (
            <div className="adl_date_value">
              {new Date(last_day).toLocaleTimeString()}
            </div>
          );
        } else {
          return <div className="adl_date_value">None Today</div>;
        }
      }
    }
  }

  let physicalContent = (
    <div>
      <div className="physical_activity_container">
        {[["light"], ["moderate"], ["vigorous"]].map((item, ind) => (
          <div
            key={ind}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <div className="medication_item">{item}</div>
              {aggPhysicalData.current.length !== 0 && (
                <div className="medication_dosage">
                  {getPhysicalLastValue(item)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  let medicationContent = (
    <MedicationContent
      getMedicationInfo={getMedicationInfo}
      resident_name={first_name + " " + last_name}
      phase={phase}
      syncDate={syncDate}
      clockCleanup={clockCleanup}
    />
  );

  return (
    <div className="summary_container">
      <LoadingOverlay visible={!finishedLoading} />

      <div>
        <div style={{ borderBottom: "1px solid #d2d2d2", marginBottom: "2%" }}>
          <div className="summary_header_container">
            <div
              className="summary_header"
              style={{ color: theme.colors.accent[5] }}
            >
              Vitals
              <div className="add_data_container"></div>
            </div>
            <div className="summary_measurement">Last Measurement Value</div>
          </div>
          {default_vitalslist.map((item) => (
            <div key={item.label} className="summary_text">
              <div>{item.label}</div>
              <div className="test_bar" />
              <div style={{ display: "flex" }}>
                <div className="adl_description">
                  {getLastVitalValue(item.label)}
                </div>
              </div>
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
          ))}
        </div>
        <div className="summary_header_container">
          <div
            className="summary_header"
            style={{ color: theme.colors.accent[5] }}
          >
            ADLs
          </div>
        </div>
        <div
          style={{
            justifyContent: "center",
            overflowX: "auto",
            maxWidth: "900px",
            maxHeight: "260px",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ width: "900px", height: "235px", overflow: "scroll" }}
            hidpi="off"
          />
        </div>
        <div className="summary_measurement" style={{ marginRight: "5vw" }}>
          Last Recorded Date/Value
        </div>
        {default_adllist.map((item) => (
          <div
            key={item.label}
            className={
              item.label === "Medication Intake"
                ? "summary_text medication"
                : item.label === "Physical Activity"
                ? "summary_text physical_activity"
                : "summary_text"
            }
          >
            <div
              style={{
                display: "flex",
                width: "-webkit-fill-available",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {getAvatar(item.label)}

              <div>{item.label}</div>
              <div className="test_bar" />
              <div style={{ display: "flex" }}>
                {item.label !== "Medication Intake" &&
                  item.label !== "Physical Activity" && (
                    <div>{getLastDay(item.label)}</div>
                  )}
              </div>
              <AddData
                resident_id={resident_id}
                first_name={first_name}
                last_name={last_name}
                input_label={"ADL"}
                value_label={item.label}
                otc_options={otc_options}
                style={{ marginLeft: "4vw" }}
                phase={phase}
                syncDate={syncDate}
                clockCleanup={clockCleanup}
                addHelper={addDataHelper}
              />
            </div>
            {item.label === "Physical Activity" && physicalContent}
            {item.label === "Medication Intake" && medicationContent}
          </div>
        ))}
        <div key={"add_adls_button"} className="summary_text">
          <div className="test_bar" />
        </div>
        <div
          className="summary_header"
          style={{ color: theme.colors.accent[5] }}
        >
          Common Locations
        </div>
        <div>{common_locations()}</div>
      </div>
    </div>
  );
};

export default Summary;
