var extraSpaceH = 50;
var extraSpaceW = 0;
var mainSpace = 600;
var tanpura;
var backColor;
var mainColor;

var soundsInfo;
var sounds = [];
var sadjaList = [];
var currentSound;
var sadja;

var buttonSearchSound;
var buttonPlay;
var buttonSadja;
var buttonRecord;

function preload () {
  soundsInfo = loadJSON("files/soundsInfo.json");
  tanpura = loadImage("files/tanpura-sombra.png");
}

function setup () {
  var canvas = createCanvas(extraSpaceW+mainSpace, extraSpaceH+mainSpace);
  var div = select("#sketch-holder");
  div.style("width: " + width + "px; margin: 10px auto; position: relative;");
  canvas.parent("sketch-holder");

  ellipseMode(RADIUS);
  angleMode(DEGREES);
  imageMode(CENTER);
  textFont("Laila");
  strokeJoin(ROUND);

  sadja = new p5.Oscillator();

  buttonSearchSound = createButton("Comienza")
    .size(75, 25)
    .position(extraSpaceW + 15, extraSpaceH + mainSpace - 40)
    .mouseClicked(soundLoader)
    .parent("sketch-holder");
  buttonPlay = createButton("Toca")
    .size(75, 25)
    .position(buttonSearchSound.x + buttonSearchSound.width + 15, buttonSearchSound.y)
    .mouseClicked(player)
    .attribute("disabled", "true")
    .parent("sketch-holder");
  buttonSadja = createButton("Ṣaḍja")
    .size(75, 25)
    .position(buttonPlay.x + buttonPlay.width + 15, buttonPlay.y)
    .mousePressed(function () {sadja.start();})
    .attribute("onmouseup", "sadja.stop()")
    .attribute("disabled", "true")
    .parent("sketch-holder");
  buttonRecord = createButton("Graba")
    .size(75, 25)
    .position(buttonSadja.x + buttonSadja.width + 15, buttonPlay.y)
    .mouseClicked(recorder)
    .attribute("disabled", "true")
    .parent("sketch-holder");

  backColor = color(205, 92, 92);
  mainColor = color(77, 208, 225);
}

function draw () {
  background(254, 249, 231);
  noStroke();
  fill(backColor);
  rect(extraSpaceW, extraSpaceH, mainSpace, mainSpace);

  stroke(0, 50);
  strokeWeight(1);
  line(extraSpaceW+15*2, extraSpaceH+15*3+27, width-15*2, extraSpaceH+15*3+27);

  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(30);
  strokeWeight(5);
  stroke(120, 0, 0);
  // mainColor.setAlpha(255);
  fill(backColor);
  text("Ṣaḍja", extraSpaceW+mainSpace/2, extraSpaceH+15*3);
  textAlign(CENTER, CENTER);
  stroke(0);
  strokeWeight(1);
  textSize(20);
  fill(0, 150);
  text("Tānpūra", extraSpaceW+mainSpace/2, extraSpaceH+15*3+45);

  push()
  translate(extraSpaceW+mainSpace/2, extraSpaceH+mainSpace/2);
  image(tanpura, 0, 10, tanpura.width/2.6, tanpura.height/2.6);
  noFill();
  stroke(120, 0, 0);
  strokeWeight(3);
  ellipse(0, 0, mainSpace/3.5, mainSpace/3.5);
  pop()
}

function player () {
  if (buttonPlay.html() == "Toca") {
    currentSound.loop();
    buttonPlay.html("Para");
    buttonRecord.removeAttribute("disabled");
  } else {
    currentSound.stop();
    buttonPlay.html("Toca");
    buttonRecord.attribute("disabled", "true");
  }
}

function recorder () {
  if (buttonRecord.html() == "Graba") {
    buttonRecord.html("Para");
    buttonSadja.attribute("disabled", "true");
    buttonPlay.attribute("disabled", "true");
  } else {
    buttonRecord.html("Graba");
    buttonSadja.removeAttribute("disabled");
    buttonPlay.removeAttribute("disabled");
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
