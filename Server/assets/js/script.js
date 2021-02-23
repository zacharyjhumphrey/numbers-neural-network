const appSocket = io();
const numberCanvas = document.getElementById('number-canvas');
const $numberCanvas = $(numberCanvas);
const ctx = numberCanvas.getContext('2d');

const pixel_count = 28;

$(function() {
  sizeWindow();

  appSocket.emit('test_event');

  // DRAWING ON THE CANVAS
  $numberCanvas.mousedown(function(downEvent) {
    drawLine(downEvent);

    $numberCanvas.mousemove(function(moveEvent) {
      drawLine(moveEvent);
    });

    $numberCanvas.mouseleave(function() {
      resetDraw();
    });

    $(window).mouseup(function() {
      resetDraw();
    });

    function resetDraw() {
      $numberCanvas.off('mousemove');
      $numberCanvas.off('mouseleave');
      $(window).off('mouseup');
    }
  });

  // CLEARING THE CANVAS
  $('.clear-canvas').mousedown(function(e) {
    clearCanvas();
  });

  // SUBMITTING THE CANVAS
  $('#submit-number').submit(function(event) {
    event.preventDefault();

    const newCanvas = getCanvasData();
    console.log(newCanvas);
    appSocket.emit('send_canvas', newCanvas);
  });

  // RECIEVING THE NUMBER
  appSocket.on('number_returned', function(data) {
    $('.guess').text(data.guess);
    console.log(data.guess);
  });
});

// BASIC FUNCTIONS
$(window).resize(function() {
  sizeWindow();
});

function sizeWindow() {
  $('.main').css({
    'height': ($(window).height() - $('nav').height())
  });

  numberCanvas.width = $numberCanvas.width();
  numberCanvas.height = $numberCanvas.height();
}

// CANVAS FUNCTIONS
function clearCanvas(e) {
  ctx.clearRect(0, 0, numberCanvas.width, numberCanvas.height);
}

function drawLine(event) {
  var pos = getPos(event);

  ctx.fillRect(
    pos.x - (pixel_count),
    pos.y - (pixel_count),
    ((numberCanvas.width / pixel_count)  * 2),
    ((numberCanvas.height / pixel_count) * 2)
  );
}

function getPos(event) {
  var rect = numberCanvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

function getCanvasData() {
  var canvasImg = ctx.getImageData(0, 0, numberCanvas.width, numberCanvas.height);
  var pixelData = canvasImg.data;

  var newData = [];
  var grayscaleData = [];

  // CONVERTING TO 1D ARRAY WITH GRAYSCALE VALUES
  for (var i = 3; i < pixelData.length; i+=4) {
    grayscaleData.push(pixelData[i]);
  }

  var frame = {
    width: Math.floor(numberCanvas.width / pixel_count),
    height: Math.floor(numberCanvas.height / pixel_count)
  }

  // LOOPING THROUGH PIXEL FRAMES
  for (var r = 0; r < pixel_count; r++) {
    newData.push([]);
    for (var c = 0; c < pixel_count; c++) {
      var pixelColor = 0;

      var i = 0;
      // LOOPING THROUGH PIXELS IN PIXEL FRAMES
      for (var pixelRow = 0; pixelRow < frame.height; pixelRow++) {
        for (var pixelCol = 0; pixelCol < frame.width; pixelCol++) {
          i += 1;
          var pixelPos = (((frame.height * r) + pixelRow) * numberCanvas.width) + ((frame.width * c) + pixelCol);

          pixelColor += grayscaleData[pixelPos];
        }
      }

      newData[r].push(pixelColor / (frame.width * frame.height));
    }
  }

  return newData;
}
