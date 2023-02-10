import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Home.css";
import { Image, useMantineTheme, Table } from "@mantine/core";
import ResidentItem from "../../components/ResidentItem/ResidentItem.js";
import { Search, CircleX } from "tabler-icons-react";

import FilterMenu from "../../components/FilterMenu/FilterMenu";
import useSortHook from "../../components/Hooks/useSortHook";

function Home({ dispatch, default_residents }) {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: "route",
      payload: {
        screenText: "List of Residents",
        currentPage: "residents",
        first_name: "",
        last_name: "",
      },
    });
  }, [dispatch]);

  const [searchValue, setsearchValue] = useState("");
  const [displayClear, setdisplayClear] = useState(false);
  const [displayType, setdisplayType] = useState("Grid");

  const { sortIcon, dynamicSortHelper } = useSortHook({
    default_column: "first_name",
  });

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

  function changeDisplayType(e) {
    setdisplayType(e);
  }

  function gotoResident(resident) {
    console.log(
      `/${resident.first_name}/${resident.last_name}/${resident.resident_id}`
    );
    navigate(
      `/resident/${resident.first_name}/${resident.last_name}/${resident.resident_id}/${resident.room}/${resident.age}/${resident.battery}`
    );
  }

  const residents = default_residents;
  const [filteredResidents, setFilteredResidents] = useState(default_residents);
  const [locationFilter, setLocationFilter] = useState(false);
  // const [statusFilter, setStatusFilter] = useState(false);
  const [buildingFilter, setBuildingFilter] = useState(false);

  useEffect(() => {
    let temp = residents;

    temp = temp.filter(
      (ele) => locationFilter === false || ele.location === locationFilter
    );
    // temp = temp.filter(
    //   (ele) => statusFilter === false || ele.status === statusFilter
    // );
    temp = temp.filter(
      (ele) => buildingFilter === false || ele.room.includes(buildingFilter)
    );

    temp = temp.filter(
      (ele) =>
        ele.first_name.toLowerCase().startsWith(searchValue.toLowerCase()) ||
        ele.last_name.toLowerCase().startsWith(searchValue.toLowerCase()) ||
        ele.location.toLowerCase().startsWith(searchValue.toLowerCase())
    );

    setFilteredResidents(temp);
  }, [locationFilter, buildingFilter, residents, searchValue]);

  return (
    <div>
      <div className="home_container">
        <div className="resident_container">
          <div className="filter_row">
            <div style={{ display: "flex" }}>
              <FilterMenu
                label="Location"
                options={[
                  "None",
                  "Activity Room",
                  "Bedroom",
                  "Den",
                  "Dining Room",
                  "Hearth Room",
                  "Kitchen",
                  "Outside Facility",
                  "Screened Porch",
                ]}
                filterHelper={setLocationFilter}
              />
              {/*<FilterMenu
                label="Status"
                options={[
                  "None",
                  "Asleep",
                  "Awake",
                  "Active",
                  "Agitated",
                  "Depressed",
                ]}
                filterHelper={setStatusFilter}
              />*/}
              <FilterMenu
                label="Building"
                options={["None", "East", "West", "North"]}
                filterHelper={setBuildingFilter}
              />
              <div className="search_bar">
                <Search className="search-icon" />
                <input
                  value={searchValue}
                  onChange={handleUserInput}
                  className="search"
                  placeholder="Search"
                  onKeyUp={handleShowClear}
                />
                <CircleX
                  style={{ visibility: displayClear ? "visible" : "hidden" }}
                  onClick={handleSearchClear}
                  className="clear-icon"
                />
              </div>
            </div>
          </div>
          <div className="sort_header">
            <div style={{ display: "flex" }}>
              <Image
                src={
                  displayType === "Grid"
                    ? `/images/navigation_icons/grid_selected.png`
                    : `/images/navigation_icons/grid.png`
                }
                style={{
                  marginRight: "50%",
                  maxWidth: "2vw",
                  cursor: "pointer",
                }}
                height={"3vh"}
                width={"auto"}
                alt={"grid_view"}
                onClick={() => changeDisplayType("Grid")}
              />
              <Image
                src={
                  displayType === "List"
                    ? `/images/navigation_icons/list_selected.png`
                    : `/images/navigation_icons/list.png`
                }
                style={{ maxWidth: "2vw", cursor: "pointer" }}
                height={"3vh"}
                width={"auto"}
                alt={"list_view"}
                onClick={() => changeDisplayType("List")}
              />
            </div>
            <p className="num_residents">
              Number of Residents: {filteredResidents.length}{" "}
            </p>
          </div>
          {displayType === "Grid" && (
            <div className="resident_grid">
              {filteredResidents.map((resident) => (
                <Link
                  style={{ textDecoration: "none", height: "fit-content" }}
                  to={`/resident/${resident.first_name}/${resident.last_name}/${resident.resident_id}/${resident.room}/${resident.location}/${resident.age}/${resident.battery}`}
                  key={resident.first_name}
                >
                  <ResidentItem
                    first_name={resident.first_name}
                    last_name={resident.last_name}
                    room={resident.room}
                    age={resident.age}
                    location={resident.location}
                    battery={resident.battery}
                  />
                </Link>
              ))}
            </div>
          )}

          {displayType === "List" && (
            <div className="resident_list">
              <Table verticalSpacing="md" fontSize="lg">
                <thead>
                  <tr style={{ backgroundColor: theme.colors.accent[5] }}>
                    <th></th>
                    <th>First Name {sortIcon("first_name")}</th>
                    <th>Last Name {sortIcon("last_name")}</th>
                    <th>Age {sortIcon("age")}</th>
                    <th>Room {sortIcon("room")}</th>
                    {/*<th>Status {sortIcon("status")}</th>*/}
                    <th>Location {sortIcon("location")}</th>
                    <th>Battery {sortIcon("battery")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResidents
                    .slice(0)
                    .sort(dynamicSortHelper())
                    .map((resident) => (
                      <tr
                        key={resident.first_name}
                        onClick={() => gotoResident(resident)}
                      >
                        <td>
                          <Image
                            style={{ maxWidth: "8vw" }}
                            src={`/images/people/${resident.first_name}.jpg`}
                            height={"5vh"}
                            width={"auto"}
                            alt={resident.first_name}
                          />
                        </td>
                        <td>{resident.first_name}</td>
                        <td>{resident.last_name}</td>
                        <td>{resident.age}</td>
                        <td>{resident.room}</td>
                        {/*<td>{resident.status}</td>*/}
                        <td>{resident.location}</td>
                        <td
                          style={{
                            color:
                              resident.battery >= 25 ? "#22B722" : "#E52B2B",
                          }}
                        >
                          {resident.battery}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Home;
