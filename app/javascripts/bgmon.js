var _bgDropCount = 0;
var _bgWaveCount = 0;

var _normalCanvasFillStyle = "#242";
var _dimCanvasFillStyle = "#131";
var _finalCanvasFillStyle = "#121";
var _cycles = 5;

var _currentCanvasFillStyle = _normalCanvasFillStyle;

var _matrices = [];
//_matrices[0] = "abcdefghijklmnopqrstuvwxyz£æšœŸþøðÞ×Ð¬º½Ä«ô»│ßµ±°¨·€§123456789@#$%^&*()*&^%+-/~{[|`]}";
//_matrices[1] = "abcdefghijklmnopqrstuvwxyz£æšœŸþøðÞ×Ð¬º½Ä«ô»│ßµ±°¨·€§123456789@#$%^&*()*&^%+-/~{[|`]}";
//_matrices[2] = "£æšœŸþøðÞ×Ð¬º½Ä«ô»│ßµ±°¨·€§123456789@#$%^&*()*&^%+-/~{[|`]}";
//_matrices[3] = "ABCDEF·€§123456789@#*()+-/~{[|]}";
_matrices[0] = "01";
//_matrices[5] = "abcdef0123456789þøðÞ×Ð¬º½Ä«ô»│ßµ±°ABCDEF*#";
//_matrices[6] = "0123456789*";
var _currentMatrix = _matrices[0];

var _bgInterval;

var _initialized = false;

function activateBackground() {
  if(!_initialized) {
    _initialized = true;
    $('body').prepend("<canvas id=\"c\" style=\"position:fixed; top:0;left:0;z-index: -1;\"></canvas>");
  }

  deactivateBackground();

  var c = document.getElementById("c");
  var ctx = c.getContext("2d");

  //making the canvas full screen
  c.height = window.innerHeight;
  c.width = window.innerWidth;

  var font_size = 10;
  var columns = c.width/font_size; //number of columns for the rain

  var drops = [];
  for(var x = 0; x < columns; x++)
      drops[x] = 1;

  _bgDropCount = 0;
  _bgWaveCount = 0;

  _currentCanvasFillStyle = _normalCanvasFillStyle;

  _currentMatrix = _matrices[getRandomInt(0, _matrices.length-1)];
  _currentMatrix = _currentMatrix.split("");

  _bgInterval = setInterval(function() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = _currentCanvasFillStyle;
    ctx.font = font_size + "px arial";

    for(var i = 0; i < drops.length; i++)
    {
      //a random character to print
      var text = _currentMatrix[Math.floor(Math.random()*_currentMatrix.length)];
      //x = i*font_size, y = value of drops[i]*font_size
      ctx.fillText(text, i*font_size, drops[i]*font_size);

      if(drops[i]*font_size > c.height) {
        drops[i] = 0;
        _bgDropCount++;
        
        if(_bgDropCount >= drops.length) {
          _currentCanvasFillStyle = _dimCanvasFillStyle;

          if(_bgDropCount >= drops.length * 2) {
            _currentCanvasFillStyle = _finalCanvasFillStyle;
          }
        }
        if(_bgDropCount >= drops.length * _cycles) {
          clearInterval(_bgInterval);
        }
      }

      //incrementing Y coordinate
      drops[i]++;
    }
  }, 25);
}

function deactivateBackground() {
  clearInterval(_bgInterval);

  try {
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
  } catch(e) {
    //do nothing;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  activateBackground,
  deactivateBackground,
  getRandomInt
}