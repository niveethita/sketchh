const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const brushColor = document.getElementById('brushColor');
const brushSize = document.getElementById('brushSize'); 
const eraser = document.getElementById('eraser');
const pen = document.getElementById('pen'); 
const clear = document.getElementById('clear');
const bgColor = document.getElementById('bgColor'); 
const fillBg = document.getElementById('fillBg');    

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