import { Image } from "@mantine/core";
import "./Sidebar.css";

function Icon({ name }) {
  return (
    <div>
      <Image
        src={`/images/navigation_icons/${name}.png`}
        height={"5vh"}
        width={"5vh"}
        alt={name}
        style={{margin:"auto"}}
      />
      <div className="icon_name">{name}</div>
    </div>
  );
}

export default Icon;
