const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const brushColor = document.getElementById('brushColor');
const brushSize = document.getElementById('brushSize'); 
const eraser = document.getElementById('eraser');
const pen = document.getElementById('pen'); 
const clear = document.getElementById('clear');
const bgColor = document.getElementById('bgColor'); 
const fillBg = document.getElementById('fillBg');    
const fillShape = document.getElementById('fillShape');    


let isDrawing = false;
let tool = 'pen'; 
ctx.lineCap = 'round';

eraser.addEventListener('click', () => {
  tool = 'eraser';  
});

pen.addEventListener('click', () => {
  tool = 'pen';
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = brushColor.value;
});

fillShape.addEventListener('click', () => {
  tool = 'fillSp';
  ctx.strokeStyle = brushColor.value;
});

canvas.addEventListener('click', (e) => {
  if (tool === 'fillSp' && !isDrawing) {
    floodFill(e.offsetX, e.offsetY, hexToRgba(brushColor.value));
  }
});

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  ctx.lineWidth = brushSize.value;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);

  if (tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = brushColor.value;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);

fillBg.addEventListener('click', () => {
  canvas.style.backgroundColor = bgColor.value;
});

clear.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
} );

function getPixelColor(pixels, x, y) {
  const i = (y * canvas.width + x) * 4;
  return [pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]];
}

function setPixelColor(pixels, x, y, color) {
  const i = (y * canvas.width + x) * 4;
  [pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]] = color;
}

function colorMatch(a, b) {
  return a[0]===b[0] && a[1]===b[1] && a[2]===b[2] && a[3]===b[3];
}

function hexToRgba(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r, g, b, 255];
}

function floodFill(startX, startY, fillColor) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data; // flat array [r,g,b,a, r,g,b,a ...]

  const targetColor = getPixelColor(pixels, startX, startY); // color you clicked on
  const stack = [[startX, startY]];

  while (stack.length) {
    const [x, y] = stack.pop();

    if (colorMatch(getPixelColor(pixels, x, y), targetColor)) {
      setPixelColor(pixels, x, y, fillColor); // paint it
      stack.push([x+1, y], [x-1, y], [x, y+1], [x, y-1]); // check neighbors
    }
  }

  ctx.putImageData(imageData, 0, 0); // write back
}

canvas.addEventListener('click', (e) => {
  if (tool === 'fillSp') {
    floodFill(e.offsetX, e.offsetY, hexToRgba(brushColor.value));
  }
});