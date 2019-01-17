var extraSpaceH = 50;
var extraSpaceW = 0;
var mainSpace = 600;
var backColor;

var soundsInfo;
var sounds = [];
var sadjaList = [];
var currentSound;
var sadja;

var buttonSearchSound;
var buttonPlay;
var buttonSadja;

function preload () {
  soundsInfo = loadJSON("files/soundsInfo.json");
}

function setup () {
  var canvas = createCanvas(extraSpaceW+mainSpace, extraSpaceH+mainSpace);
  var div = select("#sketch-holder");
  div.style("width: " + width + "px; margin: 10px auto; position: relative;");
  canvas.parent("sketch-holder");

  sadja = new p5.Oscillator();

  buttonSearchSound = createButton("Comienza")
    .size(75, 25)
    .position(extraSpaceW + 15, extraSpaceH + 15)
    .mouseClicked(soundLoader)
    .parent("sketch-holder");
  buttonPlay = createButton("Toca")
    .size(75, 25)
    .position(extraSpaceW + 15, buttonSearchSound.y + 30)
    .mouseClicked(player)
    .attribute("disabled", "true")
    .parent("sketch-holder");
  buttonSadja = createButton("Ṣaḍja")
    .size(75, 25)
    .position(extraSpaceW + 15, buttonPlay.y + 30)
    .mousePressed(function () {sadja.start();})
    .attribute("onmouseup", "sadja.stop()")
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
    currentSound.loop();
    buttonPlay.html("Para");
  } else {
    currentSound.stop();
    buttonPlay.html("Toca");
  }
}

function soundLoader () {
  if (sounds.length == 0) {
    var start = millis();
    for (var i = 0; i < Object.keys(soundsInfo).length; i++) {
      sounds[i] = loadSound("sounds/" + soundsInfo[str(i)].fileName);
      sadjaList[i] = soundsInfo[str(i)].sa;
    }
    var timeLapse = millis() - start;
    print("All sounds loaded in " + str(timeLapse) + " seconds.");
    var index = int(random(Object.keys(soundsInfo).length));
    currentSound = sounds[index];
    print(index, currentSound);
    sadja.freq(sadjaList[index]);
    buttonSearchSound.html("Re-afina");
    buttonPlay.removeAttribute("disabled");
    buttonSadja.removeAttribute("disabled");
  } else {
    if (currentSound.isPlaying()) {
      currentSound.stop();
      buttonPlay.html("Toca");
    }
    var index = int(random(Object.keys(soundsInfo).length));
    currentSound = sounds[index];
    sadja.freq(sadjaList[index]);
    print(index, currentSound);
  }
}
