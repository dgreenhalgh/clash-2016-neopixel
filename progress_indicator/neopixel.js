var five = require("johnny-five");
var pixel = require("node-pixel");

var Socket = require("./phoenix.node.js").Socket;

var socket = new Socket("ws://large-marge-server.herokuapp.com/socket", {transport: require('websocket').w3cwebsocket})

socket.connect();
var channel = socket.channel("largemarge:events", {});

function connect() {
  channel.join()
    .receive("ok", function(resp) {
      console.log("Boom!")
    })
  .receive("error", function(reason) {
    console.log("Error joining channel");
  });

  channel.on("start", function() {
    reset();
    console.log("starting");
    startStep(3);
  })

  channel.on("fetching_weather", function() {
    console.log("fetching weather");
    startStep(4);
  })

  channel.on("showing_weather", function() {
    console.log("showing weather");
    startStep(5);
  })

  channel.on("setting_outfit", function() {
    console.log("setting outfit");
    startStep(9);
  })

  channel.on("reset", function() {
    console.log("resetting");
    reset();
  })
}

var currentStep = 0;

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var TOTAL_STEP_COUNT = 10;

function reset() {
  strip.color("#000");
  currentStep = 0;
}

function light(index) {
  strip.color("#000");

  var p = strip.pixel(index);
  p.color("green");
  strip.show();
}

function startStep(index) {
  strip.color("#000");

  if (index > TOTAL_STEP_COUNT) {
    return;
  }

  if (currentStep >= index) {
    return;
  }

  currentStep = index;

  for (var i = 0; i <= index; i++) {
    console.log("lighting " + i);
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

    strip.color("#000");

    connect();
    strip.show();
  });
});
