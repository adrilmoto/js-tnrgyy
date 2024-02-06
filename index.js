// Import stylesheets
import './style.css';
import Konva from 'konva';

const exampleImage = {
  height: 1500,
  type: 'jpg',
  url: 'https://creator-cdn.icons8.com/-700gKFpc0KWg0I0IbjMJJbbndZO_R56b2Z_uCY-8IE/rs:fit:841:1500/wm:1:re:0:0:1/wmid:creator/czM6Ly9pY29uczgt/bW9vc2UtcHJvZC1h/c3NldHMvYXNzZXRz/L2VkaXRvci9tb2Rl/bC82MzAvODFiMGRm/ZjktYzQ2YS00NmIz/LTlkMjAtMTk1NTQ0/ZTliODcwLmpwZw.jpg',
  width: 841,
};

function getImage(imgSource) {
  const image = new Image(imgSource.width, imgSource.height);
  image.src = imgSource.url;
  return image;
}

// Write Javascript code!
const width = window.innerWidth;
const height = window.innerHeight - 25;

// first we need Konva core things: stage and layer
const stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
});

const layer = new Konva.Layer();
const assetNode = new Konva.Group({
  x: 0,
  y: 0,
});
const contentNode = new Konva.Image({
  name: 'item',
  image: getImage(exampleImage),
  rotation: 0,
  draggable: false,
  x: 0,
  y: 0,
  width: exampleImage.width * 0.5,
  height: exampleImage.height * 0.5,
});

const eraserGroup = new Konva.Group({
  x: 0,
  y: 0,
});

assetNode.add(contentNode);
assetNode.add(eraserGroup);

layer.add(assetNode);
stage.add(layer);
var isPaint = false;
var mode = 'eraser';

var lastLine;
var strokeSize = 10;

stage.on('mousedown touchstart', function (e) {
  isPaint = true;
  var pos = stage.getPointerPosition();
  lastLine = new Konva.Line({
    name: '',
    stroke: '#df4b26',
    strokeWidth: strokeSize,
    globalCompositeOperation:
      mode === 'brush' ? 'source-over' : 'destination-out',
    // round cap for smoother lines
    lineCap: 'round',
    lineJoin: 'round',
    // add point twice, so we have some drawings even on a simple click
    points: [pos.x, pos.y, pos.x, pos.y],
  });
  eraserGroup.add(lastLine);
});

stage.on('mouseup touchend', function () {
  isPaint = false;
});

stage.on('mousemove touchmove', function (e) {
  if (!isPaint) {
    return;
  }

  // prevent scrolling on touch devices
  e.evt.preventDefault();

  const pos = stage.getPointerPosition();
  var newPoints = lastLine.points().concat([pos.x, pos.y]);
  lastLine.points(newPoints);
  console.log('added points', newPoints);
});

var select = document.getElementById('tool');
select.addEventListener('change', function () {
  mode = select.value;
});

function restartImage() {
  eraserGroup.destroyChildren();
}

function getEraserCords() {
  return eraserGroup.children.map((line) => line.points());
}

const restartButton = document.getElementById('restart');
restartButton.addEventListener('click', (e) => {
  restartImage();
});
const getData = document.getElementById('data');
getData.addEventListener('click', (e) => {
  const data = getEraserCords();
  console.log('IT is data of all cords', data);
});

const increase = document.getElementById('increase');
const decrease = document.getElementById('decrease');
// const _return = document.getElementById('return');
increase.addEventListener('click', (e) => {
  strokeSize += 10;
});
decrease.addEventListener('click', (e) => {
  strokeSize -= 10;
});
// _return.addEventListener('click', (e) => {
//   strokeSize -= 10;
// });
