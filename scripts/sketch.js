var extraSpaceH = 50;
var extraSpaceW = 0;
var mainSpace = 600;
var backColor;

var soundsInfo;
var sounds = [];
var currentSound;

var buttonSearchSound;
var buttonPlay;

function preload () {
  soundsInfo = loadJSON("files/soundsInfo.json");
}

function setup () {
  var canvas = createCanvas(extraSpaceW+mainSpace, extraSpaceH+mainSpace);
  var div = select("#sketch-holder");
  div.style("width: " + width + "px; margin: 10px auto; position: relative;");
  canvas.parent("sketch-holder");

  buttonSearchSound = createButton("Comienza")
    .size(75, 25)
    .position(extraSpaceW + 15, extraSpaceH + 15)
    .mousePressed(soundLoader)
    .parent("sketch-holder");
  buttonPlay = createButton("Toca")
    .size(75, 25)
    .position(extraSpaceW + 15, buttonSearchSound.y + 30)
    .mousePressed(player)
    .attribute("disabled", "true")
    .parent("sketch-holder");

  backColor = color(150);
}

function draw () {
  background(254, 249, 231);
  noStroke();
  fill(backColor);
  rect(extraSpaceW, extraSpaceH, mainSpace, mainSpace);
}

function player () {
  if (buttonPlay.html() == "Toca") {
    currentSound.play();
    buttonPlay.html("Para");
    print("tocando");
  } else {
    currentSound.stop();
    buttonPlay.html("Toca");
    print("parado");
  }
}

function soundLoader () {
  if (sounds.length == 0) {
    var start = millis();
    for (var i = 0; i < Object.keys(soundsInfo).length; i++) {
      sounds[i] = loadSound("sounds/" + soundsInfo[str(i)].fileName, print("Loaded " + str(i)));
    }
    var timeLapse = millis() - start;
    print("All sounds loaded in " + str(timeLapse) + " seconds.");
    var index = int(random(Object.keys(soundsInfo).length));
    currentSound = sounds[index];
    print(index, currentSound);
    buttonSearchSound.html("Re-afina");
    buttonPlay.removeAttribute("disabled");
  } else {
    var index = int(random(Object.keys(soundsInfo).length));
    currentSound = sounds[index];
    print(index, currentSound);
  }
}
