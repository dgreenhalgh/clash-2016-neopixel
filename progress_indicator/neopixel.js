var five = require("johnny-five");
var pixel = require("node-pixel");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var TOTAL_STEP_COUNT = 10;

function light(index) {
  strip.color("#000");

  var p = strip.pixel(index);
  p.color("green");
  strip.show();
}

function startStep(index) {
  strip.color("#000");

  if (index >= TOTAL_STEP_COUNT) {
    return;
  }

  for (var i = 0; i < index; i++) {
    console.log("step " + i);
    var p = strip.pixel(i);
    p.color("green");
  }

  strip.show();
}

board.on("ready", function() {
  console.log("Board ready, let's add light");

  strip = new pixel.Strip({
    data: 6,
    length: 10,
    color_order: pixel.COLOR_ORDER.GRB,
    board: this,
    controller: "FIRMATA",
  });

  strip.on("ready", function() {
    console.log("Strip ready, let's go");

    startStep(4);

    var step = 0;
    var progress_indicator = setInterval(function() {
      startStep(step);
      step++;
      if (step >= TOTAL_STEP_COUNT) {
        step = 0;
      }
    }, 3000);
  });
});
