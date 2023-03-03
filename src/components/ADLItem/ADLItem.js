import React, { useState } from "react";
import { Card, Image, useMantineTheme } from "@mantine/core";
import "./ADLItem.css";

function ADLItem({ adl }) {
  const theme = useMantineTheme();
  const [selectedADL, setSelectedADL] = useState(false);

  function changeSelectedADL() {
    setSelectedADL(!selectedADL);
  }

  return (
    <Card
      className="adl_container"
      radius="md"
      shadow="xs"
      p="sm"
      onClick={() => changeSelectedADL()}
      style={{
        border: selectedADL ? "1px solid " + theme.colors.accent[5] : "none",
      }}
    >
      <Image
        style={{ maxWidth: "5vw" }}
        src={adl.image}
        height={"5vh"}
        width={"auto"}
        alt={adl.label}
      />
      <div className="adl_info">
        <div className="adl_info_container">
          <p className="adl_name">{adl.label}</p>
        </div>
      </div>
    </Card>
  );
}

export default ADLItem;
