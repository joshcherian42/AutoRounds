import React, { useEffect, useState, useRef } from "react";
import mapImage from "../../images/floorplan.png";
import "./Map.css";
import paper from "paper";
import ResidentMarker from "./ResidentMarker";
// import debug_animation from "./animations/debug_animation";
import breakfast_animation from "./animations/breakfast_time";
import rounds_animation from "./animations/rounds_animation";
import fall_animation from "./animations/fall_animation";
import bp_animation from "./animations/bp_animation";
import doctors_animation from "./animations/doctor_animation";
import { Search, CircleX } from "tabler-icons-react";

const floorplan = "green_house";
const step_size = 1;
const frame_rate = 3;

let count = 0;

const getAnimation = (phase) => {
  if (phase === 1) {
    return breakfast_animation;
  }
  if (phase === 2) {
    return rounds_animation;
  }
  if (phase === 3) {
    return bp_animation;
  }
  if (phase === 4) {
    return fall_animation;
  }
  if (phase === 5) {
    return doctors_animation;
  }
  return rounds_animation;
};

function Map({
  dispatch,
  phase,
  restart_animation,
  animation_status,
  cleanup,
  default_residents,
}) {
  const markers = useRef([]);
  const canvasRef = useRef();
  const imgRef = useRef();

  const animation = getAnimation(phase);

  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);

  const residents = default_residents;
  const [filteredResidents, setFilteredResidents] = useState(default_residents);

  const [searchValue, setsearchValue] = useState("");
  const [displayClear, setdisplayClear] = useState(false);
  const grid_scale = useRef(0);

  const onImgLoad = ({ target: img }) => {
    const { offsetHeight, offsetWidth } = img;
    setCanvasHeight(offsetHeight);
    setCanvasWidth(offsetWidth);
  };

  useEffect(() => {
    dispatch({
      type: "route",
      payload: {
        screenText: "Map View",
        currentPage: "map",
        first_name: "",
        last_name: "",
      },
    });

    paper.setup(canvasRef.current);
    grid_scale.current = Math.min(
      paper.view.size.width,
      paper.view.size.height
    );

    if (canvasHeight !== 0 && canvasWidth !== 0) {
      const backgroundRaster = new paper.Raster({
        source: mapImage,
        position: paper.view.center,
        size: new paper.Size(canvasWidth, canvasHeight),
        opacity: 0.5,
      });

      for (let i = 0; i < animation.length; i++) {
        markers.current.push(
          new ResidentMarker({
            grid_loc: animation[i].grid_loc,
            color: animation[i].color,
            label: animation[i].label,
            grid_scale: grid_scale.current,
            step_size: step_size,
            is_fall: phase === 4,
          })
        );
        if (restart_animation) {
          markers.current[i].generateKeypoints(true, 0, [0, 0]);
        } else {
          markers.current[i].generateKeypoints(
            false,
            animation_status[i].index,
            animation_status[i].pos
          );
        }
      }

      paper.view.update();

      paper.view.onFrame = () => {
        // if (false) {
        // true/false to turn off animation
        if (count % frame_rate === 0) {
          markers.current.forEach((marker) => marker.updatePosition());
        }
        count += 1;
        paper.view.update();
      };
    }
  }, [canvasHeight, canvasWidth, dispatch]);

  useEffect(
    () => () => {
      cleanup(
        markers.current.map((marker) => {
          return { index: marker.index, pos: marker.getPosition() };
        })
      );
    },
    []
  );

  useEffect(() => {
    let temp = residents;

    temp = temp.filter(
      (ele) =>
        ele.first_name.toLowerCase().startsWith(searchValue.toLowerCase()) ||
        ele.last_name.toLowerCase().startsWith(searchValue.toLowerCase()) ||
        ele.location.toLowerCase().startsWith(searchValue.toLowerCase())
    );

    setFilteredResidents(temp);
  }, [residents, searchValue]);

  function handleShowClear(e) {
    if (e.target.value && !displayClear) {
      setdisplayClear(true);
    } else if (!e.target.value) {
      setdisplayClear(false);
    }
  }

  const handleUserInput = (e) => {
    setsearchValue(e.target.value);
  };

  function handleSearchClear(e) {
    setsearchValue("");
    setdisplayClear(false);
  }

  return (
    <div>
      <div className="home_container">
        {canvasHeight === 0 && canvasWidth === 0 && (
          <img
            id="green_house_image"
            onLoad={onImgLoad}
            src={mapImage}
            alt={"Floorplan"}
            ref={imgRef}
          />
        )}
        <canvas
          id={floorplan}
          ref={canvasRef}
          style={{ width: canvasWidth, height: canvasHeight }}
          hidpi="off"
        />
        <div className="map_sidebar">
          <div className="map_sidebar_container">
            <div className="map_search_bar">
              <Search className="search-icon" />
              <input
                value={searchValue}
                onChange={handleUserInput}
                className="map_search"
                placeholder="Search"
                onKeyUp={handleShowClear}
              />
              <CircleX
                style={{ visibility: displayClear ? "visible" : "hidden" }}
                onClick={handleSearchClear}
                className="clear-icon"
              />
            </div>
            <div className="map_resident_title"> Residents </div>
            <div className="map_resident_header">
              <div>Name</div>
              <div>Location</div>
            </div>
            <div>
              {filteredResidents.map((resident) => (
                <div className="map_resident">
                  <div>
                    {resident.first_name} {resident.last_name}
                  </div>
                  <div>{resident.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;
