// let 전역변수들
let stateNow = 'preTitle';
let preTextCount = 0;
let customFont;

function preload() {
// 폰트, 이미지, 사운드 프리로드
customFont = loadFont('DungGeunMo.ttf');
}

function setup() {
  createCanvas(1920, 1080);
/*   setupTitle();
  setupMain1();
  setupMain2();
  setupMain3();
  setupMain4();
  setupAnswer();
  setupEnding(); */
}

function draw() {
  switch (stateNow) {
    case 'preTitle' :
      drawPreTitle();
      break;
    case 'title' :
/*       drawTitle(); */
      break;
    case 'main1' :
      break;
    case 'main2' :
      break;
    case 'main3' :
      break;
    case 'main4' :
      break;
    case 'answer' :
      break;
    case 'ending' :
      break;
  }
}

function keyPressed() {
  if (key === 'f') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
  if (preTextCount == 0 && keyCode === ENTER) {
    preTextCount += 1;
  }
}

function drawPreTitle() {
  background(200,2,18);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(50);
  textFont(customFont);
  text("어머, 얼마 뒤면 수민이 생일이구나!\n항상 나한테 반갑게 인사해주고, 정말 고마운 친구라 꼭 챙겨주고 싶은데...\n그래, 이번에는 ", width / 2, 150);
}