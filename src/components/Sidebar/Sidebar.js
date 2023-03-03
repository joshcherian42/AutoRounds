import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import Icon from "./Icon.js";
import { useMantineTheme, Indicator } from "@mantine/core";

function Sidebar({ page, numActions }) {
  const theme = useMantineTheme();
  const selectedIcon = useRef("residents");

  function changeSelectedIcon(view) {
    selectedIcon.current = view;
  }

  changeSelectedIcon(page);

  return (
    <div
      style={{ backgroundColor: theme.colors.accent[5] }}
      className="sidebar_container"
    >
      <Link
        style={{
          backgroundColor:
            selectedIcon.current === "residents"
              ? theme.colors.accent[3]
              : "transparent",
        }}
        className="sidebar_icon"
        to="/"
      >
        <Icon name="residents" />
      </Link>
      <Link
        style={{
          backgroundColor:
            selectedIcon.current === "map"
              ? theme.colors.accent[3]
              : "transparent",
        }}
        className="sidebar_icon"
        to="/map"
      >
        <Icon name="map" />
      </Link>
      <Link
        style={{
          backgroundColor:
            selectedIcon.current === "notes"
              ? theme.colors.accent[3]
              : "transparent",
        }}
        className="sidebar_icon"
        to="/notes"
      >
        <Indicator
          disabled={numActions === 0}
          label={parseInt(numActions)}
          inline
          color="red"
          position="top-end"
          size={15}
          offset={5}
        >
          <Icon name="notes" />
        </Indicator>
      </Link>
    </div>
  );
}

export default Sidebar;
