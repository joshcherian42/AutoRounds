import paper from "paper";

class ResidentMarker {
  constructor(options) {
    const { grid_loc, color, label, grid_scale, step_size, is_fall } = options;
    this.grid_loc = grid_loc;
    this.color = color;
    this.label = label;
    this.grid_scale = grid_scale;
    this.step_size = step_size;
    this.is_fall = is_fall;
  }
  marker_size = 5;
  offset_x = 0;
  offset_y = -this.marker_size * 2.5;

  index = 0;
  slope = 0;
  keypoints = [];

  offsetLabel = (pt) => {
    return new paper.Point({
      x: pt.x + this.offset_x,
      y: pt.y + this.offset_y,
    });
  };

  getSlope = (arr, ind, circle) => {
    let slope =
      (arr[ind].y - circle.position.y) / (arr[ind].x - circle.position.x);
    return slope;
  };

  generateMarker = (restart_animation, index, starting_pos) => {
    let x_val = this.keypoints[0].x;
    let y_val = this.keypoints[0].y;
    if (!restart_animation) {
      // Set the index and starting position based on current progress in animation
      this.index = index;
      x_val = starting_pos.x;
      y_val = starting_pos.y;
    }

    if (!this.is_fall) {
      this.marker = new paper.Path.Circle({
        center: new paper.Point(x_val, y_val),
        radius: this.marker_size,
        fillColor: this.color,
      });
    } else {
      this.marker = new paper.Path.Star({
        center: new paper.Point(x_val, y_val),
        points: 5,
        radius1: this.marker_size,
        radius2: this.marker_size * 2,
        fillColor: "red",
      });
    }

    const textSizing = new paper.PointText({
      point: this.offsetLabel(this.marker.position),
      content: this.label,
      fillColor: null,
      fontSize: this.marker_size * 2,
      fontWeight: "bold",
      justification: "center",
    });
    this.markerTextBg = new paper.Path.Rectangle({
      point: new paper.Point(textSizing.bounds.topLeft),
      size: [textSizing.bounds.width, textSizing.bounds.height],
      fillColor: "white",
      opacity: 1,
    });
    this.markerText = new paper.PointText({
      point: this.offsetLabel(this.marker.position),
      content: this.label,
      fillColor: "black",
      fontSize: this.marker_size * 2,
      fontWeight: "bold",
      justification: "center",
    });
  };

  generateKeypoints = (restart_animation, index, starting_pos) => {
    // let debug;
    for (let i = 0; i < this.grid_loc.length; i++) {
      this.keypoints.push(
        new paper.Point({
          x: this.grid_loc[i][0] * this.grid_scale,
          y: this.grid_loc[i][1] * this.grid_scale,
        })
      );
      //   debug = new paper.Path.Circle({
      //     center: grid_points[i],
      //     radius: marker_size,
      //     // fillColor: "purple",
      //   });
      //   // debug.fillColor.hue += i * 30;
      //   debug.fillColor = null;
    }

    this.generateMarker(restart_animation, index, starting_pos);

    this.slope = this.getSlope(this.keypoints, this.index, this.marker);
  };

  getPosition = () => {
    return this.marker.position;
  };

  updatePosition = () => {
    let delta_x = 0;
    let delta_y = 0;
    let mag = 0;

    if (this.index < this.keypoints.length - 1) {
      if (
        this.marker.position.getDistance(this.keypoints[this.index]) <
        this.marker_size
      ) {
        this.index =
          this.index < this.keypoints.length - 1 ? this.index + 1 : 0;
        this.slope = this.getSlope(this.keypoints, this.index, this.marker);
      } else {
        delta_x =
          this.marker.position.x < this.keypoints[this.index].x
            ? this.step_size
            : -this.step_size;
        delta_y = this.slope * delta_x;

        mag = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
        delta_x /= mag;
        delta_y /= mag;
        this.marker.position.x += delta_x;
        this.marker.position.y += delta_y;
        this.markerTextBg.position = this.markerText.bounds.center;
        this.markerText.position = this.offsetLabel(this.marker.position);
      }
    }
  };
}

export default ResidentMarker;
