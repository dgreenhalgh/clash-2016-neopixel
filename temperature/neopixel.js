var five = require("johnny-five");
var pixel = require("node-pixel");

var Socket = require("./phoenix.node.js").Socket;

var socket = new Socket("ws://large-marge-server.herokuapp.com/socket", {transport: require('websocket').w3cwebsocket})

socket.connect();
var channel = socket.channel("largemarge:events", {});

channel.join()
  .receive("ok", function(resp) {
    console.log("Boom!")
  })
  .receive("error", function(reason) {
    console.log("Error joining channel");
  });

  channel.on("start", function() {
    console.log("starting");
//    startStep(2);
})

// TODO: Respond to more events



var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var tempMap = new Map();

function initTempMap() {
  tempMap.set(32, "#ffffff");
  tempMap.set(50, "#0000ff");
  tempMap.set(55, "#0066ff");
  tempMap.set(60, "#3399ff");
  tempMap.set(65, "#66ccff");
  tempMap.set(70, "#ffff00");
  tempMap.set(75, "#ffcc00");
  tempMap.set(80, "#ff9900");
  tempMap.set(85, "#ff6600");
  tempMap.set(212, "#ff0000");
}

function setTemp(temp) {
  strip.color("#000");
  
  var c = "#ffffff";

  tempMap.forEach(function(value, key) {
    if (key < temp) {
      c = value;
    }
  }, tempMap)

  console.log(c);

  for (var i = 0; i < 10; i++) {
    var p = strip.pixel(i);
    p.color(c);
  }

  strip.show();
}

board.on("ready", function() {
  console.log("Board ready, let's add light");

  strip = new pixel.Strip({
    data: 7,
    length: 10,
    color_order: pixel.COLOR_ORDER.GRB,
    board: this,
    controller: "FIRMATA",
  });

  strip.on("ready", function() {
    console.log("Strip ready, let's go");

    initTempMap();

    strip.color("#000");

    setTemp(-30); // TODO: Pull temp from weather message
    strip.show();
  });
});

