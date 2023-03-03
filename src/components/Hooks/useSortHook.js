import { useState } from "react";
import { ArrowsSort, SortAscending, SortDescending } from "tabler-icons-react";

const useSortHook = ({ default_column }) => {
  const [sortDirection, setsortDirection] = useState("unsorted");
  const [sortColumn, setsortColumn] = useState(default_column);

  function sortBy(column) {
    if (sortColumn === column) {
      if (sortDirection === "unsorted") {
        setsortDirection("ascending");
      } else if (sortDirection === "ascending") {
        setsortDirection("descending");
      } else {
        setsortDirection("unsorted");
      }
    } else {
      setsortDirection("ascending");
    }

    setsortColumn(column);
  }

  function sortIcon(column) {
    if (sortDirection === "ascending" && sortColumn === column) {
      return (
        <SortAscending
          onClick={() => sortBy(column)}
          width="16"
          height="16"
          className="sort_icon"
        />
      );
    } else if (sortDirection === "descending" && sortColumn === column) {
      return (
        <SortDescending
          onClick={() => sortBy(column)}
          width="16"
          height="16"
          className="sort_icon"
        />
      );
    } else {
      return (
        <ArrowsSort
          onClick={() => sortBy(column)}
          width="16"
          height="16"
          className="sort_icon"
        />
      );
    }
  }

  function dynamicSort(property) {
    return function (a, b) {
      if (sortDirection === "descending") {
        if (typeof a[property] === "number") {
          return b[property] - a[property];
        } else {
          return String(b[property]).localeCompare(String(a[property]));
        }
      } else if (sortDirection === "ascending") {
        if (typeof a[property] === "number") {
          return a[property] - b[property];
        } else {
          return String(a[property]).localeCompare(String(b[property]));
        }
      } else {
        return a;
      }
    };
  }

  const dynamicSortHelper = () => {
    return dynamicSort(sortColumn);
  };

  return { sortIcon, dynamicSortHelper };
};

export default useSortHook;
