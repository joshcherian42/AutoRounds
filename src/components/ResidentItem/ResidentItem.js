import { Card, Image, useMantineTheme, Avatar } from "@mantine/core";
import "./ResidentItem.css";
import {
    Disabled,
    Battery,
    Battery1,
    Battery2,
    Battery3,
    Battery4,
    BatteryOff,
} from "tabler-icons-react";

function ResidentItem({ first_name, last_name, room, age, location, battery }) {
    const theme = useMantineTheme();
    const walker_image = "/images/health_icons/walker.svg";
    const cane_image = "/images/health_icons/cane.svg";

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

    return (
        <div>
            <Card className="item_container" radius="md" shadow="xs" p="sm">
                <Image
                    style={{ maxWidth: "8vw", alignSelf: "center" }}
                    src={`/images/people/${first_name}.jpg`}
                    height={"120px"}
                    width={"auto"}
                    alt={first_name}
                />
                <div
                    className="resident_info"
                    style={{ color: theme.colors.font[0] }}
                >
                    <div
                        style={{
                            width: "-webkit-fill-available",
                            whiteSpace: "nowrap",
                            diplay: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <p className="resident_name">
                                {first_name} {last_name}
                            </p>
                            <p className="resident_age">
                                <span className="resident_category">Age:</span>{" "}
                                {age}
                            </p>
                            <p className="resident_room">
                                <span className="resident_category">Room:</span>{" "}
                                {room}
                            </p>
                            <p className="resident_location">
                                <span className="resident_category">
                                    Location:
                                </span>{" "}
                                {location}
                            </p>
                        </div>
                        <div>
                            {first_name === "Stanley" &&
                                last_name === "Sherman" && (
                                    <div>
                                        <Avatar
                                            src={walker_image}
                                            style={{
                                                width: "24px",
                                                minWidth: "24px",
                                                height: "24px",
                                                minHeight: "24px",
                                            }}
                                        />
                                    </div>
                                )}
                            {first_name === "Mike" && last_name === "Kent" && (
                                <div>
                                    <Disabled color={theme.colors.accent[6]} />
                                </div>
                            )}
                            {first_name === "Nick" && last_name === "Miller" && (
                                <div>
                                    <Avatar
                                        src={cane_image}
                                        style={{
                                            width: "24px",
                                            minWidth: "24px",
                                            height: "24px",
                                            minHeight: "24px",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ textAlign: "end" }}>
                        <p className="resident_battery">
                            {get_battery_icon(Number(battery))}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default ResidentItem;
