import { useState } from "react";
import { Menu, Button } from "@mantine/core";
import { ChevronDown } from "tabler-icons-react";

const FilterMenu = ({ label, options, filterHelper }) => {
  const [selected, setSelected] = useState(label);

  const setSelectedHelper = (val) => {
    if (val === options[0]) {
      setSelected(label);
      filterHelper(false); // no filter
    } else {
      setSelected(val);
      filterHelper(val); // filter by val
    }
  };

  return (
    <Menu
      className="cafeteria_filter"
      control={
        <Button variant="light" compact style={{ height: "28px" }}>
          {selected} <ChevronDown />
        </Button>
      }
    >
      {options.map((ele) => (
        <Menu.Item key={ele} onClick={() => setSelectedHelper(ele)}>
          {ele}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default FilterMenu;
