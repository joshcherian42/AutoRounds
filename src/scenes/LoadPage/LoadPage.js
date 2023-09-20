import { Button } from "@mantine/core";
import ambulation_query from "../../utils/queries/insert_ambulation";
import bathroom_query from "../../utils/queries/insert_bathroom";
import blood_pressure_query from "../../utils/queries/insert_blood_pressure";
import dressing_query from "../../utils/queries/insert_dressing";
import eating_query from "../../utils/queries/insert_eating";
import fluid_query from "../../utils/queries/insert_fluid";
import glucose_query from "../../utils/queries/insert_glucose";
import heart_rate_query from "../../utils/queries/insert_heart_rate";
import showering_query from "../../utils/queries/insert_showering";
import weight_query from "../../utils/queries/insert_weight";
import taking_medication_query from "../../utils/queries/insert_taking_medication";

import { Table } from "@mantine/core";

const LoadPage = () => {
  const query = (val) => {
    fetch("/api/runQuery", {
      method: "POST",
      body: JSON.stringify({ query: val }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (res.ok) {
        console.log("Added data");
      }
    });
  };

  return (
    <div>

      <Table verticalSpacing="md" fontSize="lg">
        <tbody>
          <tr>
            <td>Ambulation</td>
            <td>
              <Button
                onClick={() => {
                  query(ambulation_query);
                }}
              >
                Load Ambulation
              </Button>
            </td>
            <td>
              <Button
                onClick={() => {
                  query("delete from ambulation;");
                }}
              >
                Delete Ambulation
              </Button>
            </td>
          </tr>
          <tr>
            <td>Blood Pressure</td>
            <td>
              <Button
                onClick={() => {
                  query(blood_pressure_query);
                }}
              >
                Load Blood Pressure
              </Button>
            </td>
            <td>
              <Button
                onClick={() => {
                  query("delete from blood_pressure;");
                }}
              >
                Delete Blood Pressure
              </Button>
            </td>
          </tr>
          <tr>
            <td>Bathroom</td>
            <td>
              <Button
                onClick={() => {
                  query(bathroom_query);
                }}
              >
                Load Bathroom
              </Button>
            </td>
            <td>
              <Button
                onClick={() => {
                  query("delete from binary_adls where adl_type='bathroom';");
                }}
              >
                Delete Bathroom
              </Button>
            </td>
          </tr>
          <tr>
            <td>Dressing</td>
            <td>
              <Button
                onClick={() => {
                  query(dressing_query);
                }}
              >
                Load Dressing
              </Button>
            </td>
            <td>
              <Button
                onClick={() => {
                  query("delete from binary_adls where adl_type='dressing';");
                }}
              >
                Delete Dressing
              </Button>
            </td>
          </tr>
          <tr>
            <td>Eating</td>
            <td>
              <Button
                onClick={() => {
                  query(eating_query);
                }}
              >
                Load Eating
              </Button>
            </td>
            <td>
              <Button
                onClick={() => {
                  query("delete from eating;");
                }}
              >
                Delete Eating
              </Button>
            </td>
          </tr>
          <tr>
            <td>Fluids</td>
            <td>
              <Button
                onClick={() => {
                  query(fluid_query);
                }}
              >
                Load Fluids
              </Button>
            </td>
            <td>
              <Button
                onClick={() => {
                  query("delete from fluids;");
                }}
              >
                Delete Fluids
              </Button>
            </td>
          </tr>
          <tr>
            <td>Glucose</td>
            <td>
              <Button
                onClick={() => {
                  query(glucose_query);
                }}
              >
                Load Glucose
              </Button>
            </td>
            <td>
              <Button
                onClick={() => {
                  query("delete from vitals where vital_type='glucose';");
                }}
              >
                Delete Glucose
              </Button>
            </td>
          </tr>
          <tr>
            <td>Heart Rate</td>
            <td>
              <Button
                onClick={() => {
                  query(heart_rate_query);
                }}
              >
                Load Heart Rate
              </Button>
            </td>
            <td>
              <Button
                onClick={() => {
                  query("delete from vitals where vital_type='heart_rate';");
                }}
              >
                Delete Heart Rate
              </Button>
            </td>
          </tr>
          <tr>
            <td>Showering</td>
            <td>
              <Button
                onClick={() => {
                  query(showering_query);
                }}
              >
                Load Showering
              </Button>
            </td>
            <td>
              <Button
                onClick={() => {
                  query("delete from binary_adls where adl_type='showering';");
                }}
              >
                Delete Showering
              </Button>
            </td>
          </tr>
          <tr>
            <td>Weight</td>
            <td>
              <Button
                onClick={() => {
                  query(weight_query);
                }}
              >
                Load Weight
              </Button>
            </td>
            <td>
              <Button
                onClick={() => {
                  query("delete from vitals where vital_type='weight';");
                }}
              >
                Delete Weight
              </Button>
            </td>
          </tr>
          <tr>
            <td>Taking Medication</td>
            <td>
              <Button
                onClick={() => {
                  query(taking_medication_query);
                }}
              >
                Load Taking Medication
              </Button>
            </td>
            <td>
              <Button
                onClick={() => {
                  query("delete from taking_medication;");
                }}
              >
                Delete Taking Medication
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default LoadPage;
