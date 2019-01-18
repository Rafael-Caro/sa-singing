var extraSpaceH = 55;
var extraSpaceW = 0;
var mainSpace = 600;
var tanpura;
var backColor;
var mainColor;

var soundsInfo;
var sounds = [];
var soundsList;
var sadjaList = [];
var mic, recorder, recFile;
var currentSound;
var sadja;

var selectMode;
var selectLevel;
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

  mic = new p5.AudioIn();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  soundFile = new p5.SoundFile();
  sadja = new p5.Oscillator();

  selectMode = createSelect()
    .size(120, 25)
    .position(15, 15)
    .changed(changeMode)
    .parent("sketch-holder");
  selectMode.option("Modo estudio", "0");
  selectMode.option("Modo práctica", "1");
  selectLevel = createSelect()
    .size(100, 25)
    .position(selectMode.x + selectMode.width + 10, 15)
    .changed(changeLevel)
    .parent("sketch-holder");
  selectLevel.option("Nivel 1", "level1");
  selectLevel.option("Nivel 2", "level2");
  selectLevel.option("Nivel 3", "level3");
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
  buttonSadja = createButton("SA")
    .id("sadja")
    .size(40, 40)
    .position(extraSpaceW + mainSpace/2 - 20, extraSpaceH+mainSpace/2+mainSpace/3.5-20)
    .mousePressed(function () {sadja.start();})
    .style("border-radius", "50%")
    .style("font-family", "Laila")
    .style("font-size", "15px")
    .style("font-weight", "bold")
    // .style("background-color", "rgb(205, 92, 92)")
    // .style("border", "3px solid rgb(120, 0, 0)")
    .attribute("onmouseup", "sadja.stop()")
    .attribute("disabled", "true")
    .parent("sketch-holder");
  buttonRecord = createButton("Graba")
    .size(100, 25)
    .position(buttonPlay.x + buttonPlay.width + 15, buttonPlay.y)
    .mouseClicked(recordVoice)
    .attribute("disabled", "true")
    .attribute("hidden", "true")
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
    if (buttonRecord.html() == "Graba") {
      buttonRecord.removeAttribute("disabled");
    } else {
      buttonRecord.attribute("disabled", "true");
    }
  } else {
    currentSound.stop();
    buttonPlay.html("Toca");
    if (buttonRecord.html() == "Graba") {
      buttonRecord.attribute("disabled", "true");
    } else {
      buttonRecord.removeAttribute("disabled");
    }
  }
}

function recordVoice () {
  if (buttonRecord.html() == "Graba") {
    buttonSearchSound.attribute("disabled", "true");
    buttonPlay.attribute("disabled", "true");
    buttonSadja.attribute("disabled", "true");
    buttonRecord.html("Grabando...");
    buttonRecord.attribute("disabled", "true");
    recorder.record(soundFile, 5, function () {
      currentSound.stop();
      buttonSearchSound.removeAttribute("disabled");
      buttonPlay.removeAttribute("disabled");
      buttonPlay.html("Toca");
      buttonSadja.removeAttribute("disabled");
      buttonRecord.html("¡Escúchate!");
      buttonRecord.removeAttribute("disabled");
      mic.stop();
    });
  } else {
    soundFile.play();
    currentSound.loop(0, currentSound.rate(), 0.2);
    buttonSearchSound.attribute("disabled", "true");
    buttonPlay.attribute("disabled", "true");
    buttonRecord.attribute("disabled", "true");
    soundFile.onended(function () {
      currentSound.stop();
      buttonSearchSound.removeAttribute("disabled");
      buttonPlay.removeAttribute("disabled");
      buttonRecord.removeAttribute("disabled");
    });
  }
}

function changeMode () {
  if (selectMode.value() == "0") {
    buttonRecord.attribute("hidden", "true");
    retune();
    mic.stop();
  } else {
    buttonRecord.removeAttribute("hidden");
    buttonSadja.attribute("disabled", "true");
    retune();
  }
}

function changeLevel () {
  soundsList = soundsInfo.levels[selectLevel.value()];
  retune();
}

function soundLoader () {
  if (sounds.length == 0) {
    var start = millis();
    for (var i = 0; i < soundsInfo.soundsLib.length; i++) {
      print(soundsInfo.soundsLib[str(i)].fileName);
      sounds[i] = loadSound("sounds/" + soundsInfo.soundsLib[str(i)].fileName);
      sadjaList[i] = soundsInfo.soundsLib[str(i)].sa;
    }
    var timeLapse = millis() - start;
    print("All sounds loaded in " + str(timeLapse) + " seconds.");
    soundsList = soundsInfo.levels[selectLevel.value()];
    retune();
    buttonSearchSound.html("Re-afina");
    buttonPlay.removeAttribute("disabled");
    buttonSadja.removeAttribute("disabled");
  } else {
    retune();
  }
}

function retune () {
  if (currentSound != undefined && currentSound.isPlaying()) {
    currentSound.stop();
    buttonPlay.html("Toca");
  }
  var index = soundsList[int(random(soundsList.length))];
  currentSound = sounds[index];
  sadja.freq(sadjaList[index]);
  print(index, currentSound, currentSound.duration());
  buttonRecord.html("Graba");
  buttonRecord.attribute("disabled", "true");
  if (selectMode.value() == "1") {
    mic.start();
    buttonSadja.attribute("disabled", "true");
    soundFile = new p5.SoundFile();
  }
}
