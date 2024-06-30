// let 전역변수들
let customFont;
let stateNow = 'loading';
let titleBG, mainBG, story01, story02, story03, story04;
let loadingProgress = 0; // 로딩 진행률 변수

// pre-title에서 필요한 것
let titleNumber = 1;

let displayedText = "";
let fullText = "";
let charIndex = 0;
let lastTypedTime = 0;
let typingSpeed = 90;
let textCompleted = false;
let enterButtonVisible = false;
let titleTextDelayed = false; // 텍스트 지연 변수 추가

// title 변수
let alphaValue = 0;
let titleCompleted = false;
let titleDisplayStartTime = null;
let titleCompletedStartTime = null;
let startButtonVisible = false; // 시작 버튼이 보이는지 여부

// main 변수
let userInput = '';
let correctWords = ["기타", "기타 연주", "기타연주", "기타 연주 하기", "기타 연주하기"];
let input;
let message = '';

function preload() {
    // 폰트, 이미지, 사운드 프리로드
    customFont = loadFont('DungGeunMo.ttf');
    story01 = loadImage('asset/story1.png');
    story02 = loadImage('asset/story2.png');
    story03 = loadImage('asset/story3.png');
    story04 = loadImage('asset/story4.png');
    titleBG = loadImage('asset/screenshot.png');
    mainBG = loadImage('asset/mainbg.png');
}

function setup() {
    createCanvas(1920, 1080);
    textFont(customFont);
    updateTitleContent();

    input = createInput();
    input.size(200, 30); // 입력 필드 크기 설정
    input.style('font-size', '20px'); // 폰트 크기 설정
    input.style('border', '2px solid #000'); // 테두리 설정
    input.style('padding', '5px'); // 패딩 설정
    input.style('border-radius', '10px'); // 둥근 테두리 설정
    input.style('outline', 'none'); // 포커스 시 아웃라인 제거
    input.changed(handleInput); // 엔터키를 누를 때 handleInput 함수 호출
    input.hide(); // 처음엔 숨김
}

function draw() {
    switch (stateNow) {
        case 'loading':
            drawLoading();
            break;
        case 'pretitle':
            drawpreTitle();
            break;
        case 'title':
            drawTitle();
            break;
        case 'main1':
            drawMain1();
            break;
        case 'main2':
            drawMain2();
            break;
        case 'main3':
            drawMain3();
            break;
        case 'main4':
            drawMain4();
            break;
        case 'answer':
            drawAnswer();
            break;
        case 'ending':
            drawEnding();
            break;
    }

    // stateNow가 'ending'일 때 input 필드를 숨김
    if (stateNow === 'ending') {
        input.hide();
    }
}

function keyPressed() {
    if (key === 'f') {
        let fs = fullscreen();
        fullscreen(!fs);
    }

    // 엔터 키를 누르면 타이틀 번호 증가 및 텍스트, 이미지 갱신
    if (keyCode === ENTER) {
        if (stateNow === 'pretitle' && textCompleted) {
            if (titleNumber < 4) {
                titleNumber += 1;
                updateTitleContent();
                resetText();
                titleTextDelayed = false; // 텍스트 지연 변수 초기화
            } else {
                stateNow = 'title';
                alphaValue = 0; // 페이드 아웃을 초기화
            }
        } else if (stateNow === 'main1') {
            handleInput(); // main1 상태에서만 handleInput 호출
        }
    }

    // 스페이스바를 누르면 타이핑 애니메이션 건너뛰기
    if (keyCode === 32) { // 32는 스페이스바의 키 코드입니다.
        if (stateNow === 'pretitle' && !textCompleted) {
            displayedText = fullText; // 모든 텍스트를 한 번에 표시
            charIndex = fullText.length;
            textCompleted = true;
            enterButtonVisible = true; // 엔터 버튼 표시 설정
        }
        // stateNow가 'title'이고 'START' 텍스트가 화면에 표시되었을 때
        if (stateNow === 'title' && startButtonVisible) {
            stateNow = 'main1';
        }
    }
}

function drawLoading() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("Loading", width / 2, height / 2 - 50);

    // 로딩 바 그리기
    let barWidth = 500;
    let barHeight = 50;
    let barX = (width - barWidth) / 2;
    let barY = height / 2;
    stroke(255);
    strokeWeight(5);
    noFill();
    rect(barX, barY, barWidth, barHeight);

    // 로딩 진행률 표시
    noStroke();
    fill(255);
    let progressWidth = map(loadingProgress, 0, 100, 0, barWidth);
    rect(barX, barY, progressWidth, barHeight);

    // 로딩 진행
    if (loadingProgress < 100) {
        loadingProgress += 1; // 로딩 속도를 조절하려면 이 값을 변경하세요
    } else {
        stateNow = 'pretitle';
    }
}

function typeText(fullText, x, y, fontSize, fontColor, typingSpeed) {
    textSize(fontSize);
    fill(fontColor);
    let currentTime = millis();

    if (currentTime - lastTypedTime > typingSpeed && charIndex < fullText.length) {
        displayedText += fullText.charAt(charIndex);
        charIndex++;
        lastTypedTime = currentTime;
    }

    text(displayedText, x, y);

    // 텍스트가 모두 타이핑된 후 완료 상태로 설정
    if (charIndex >= fullText.length) {
        textCompleted = true;
        enterButtonVisible = true; // 엔터 버튼 표시 설정
    }
}

function resetText() {
    displayedText = "";
    charIndex = 0;
    lastTypedTime = 0;
    textCompleted = false;
    enterButtonVisible = false;
}

function updateTitleContent() {
    switch (titleNumber) {
        case 1:
            currentImage = story01;
            fullText = "바람이의 생일이 얼마 남지 않았네.\n항상 나를 챙겨주는 고마운 친구니까 이번엔 내가 꼭 잘 챙겨줘야지!\n이왕이면 서프라이즈로 생일 선물을 준비하고 싶은데…";
            break;
        case 2:
            currentImage = story02;
            fullText = "바람이는 요즘 뭘 좋아하지..?\n어떻게 하면 물어보지 않고 알아낼 수 있을까?";
            break;
        case 3:
            currentImage = story03;
            fullText = "아, 맞아. 바람이는 인스타그램을 자주 한다고 했지.\n바람이 인스타를 확인해 봐야겠다!";
            break;
        case 4:
            currentImage = story04;
            fullText = "그런데 내가 과연 인스타그램을 볼 수 있을까..?";
            break;
        default:
            currentImage = story01;
            fullText = "PMI";
            break;
    }
}

function drawpreTitle() {
    // 배경과 일러스트
    background(0);
    image(currentImage, (width / 2) - (650 / 2), 100, 650, 650);

    // 텍스트 박스 (색, 아웃라인, 사이즈)
    fill(255, 255, 255, 30);
    stroke(255);
    strokeWeight(3);
    rectMode(CENTER);
    rect(width / 2, 905, width - 220, 200, 20);

    // 텍스트 타이핑 애니메이션
    textAlign(CENTER, CENTER);
    strokeWeight(1);
    if (!titleTextDelayed) {
        setTimeout(() => {
            titleTextDelayed = true;
        }, 1000); // 1초 (1000밀리초) 후에 titleTextDelayed를 true로 설정
    }

    if (titleTextDelayed) {
        typeText(fullText, width / 2, 900, 35, 255, typingSpeed);
    }

    // 모든 텍스트가 표시된 후 엔터 버튼 즉시 표시
    if (enterButtonVisible) {
        if (frameCount % 60 < 30) {
            fill(255);
        } else {
            fill(255, 255, 255, 90);
        }

        stroke(255);
        strokeWeight(3);
        rect(1715, 950, 130, 50, 5);

        fill(0);
        noStroke();
        textSize(45);
        textAlign(CENTER, CENTER);
        text("ENTER", 1715, 945);
    }
}

function drawTitle() {
    background(titleBG);
    noStroke();
    fill(0, 0, 0, alphaValue); // 검정색 rect 투명도 설정
    rectMode(CORNER);
    rect(0, 0, width, height); // 화면 크기의 rect 그리기

    // 0.1초마다 투명도 30씩 증가
    if (frameCount % 6 === 0 && alphaValue < 255) {
        alphaValue += 30;
    }

    if (alphaValue >= 255 && !titleDisplayStartTime) {
        titleDisplayStartTime = millis(); // 현재 시간을 저장
    }

    // 타이머가 1초(1000ms) 경과했을 때 텍스트 표시
    if (titleDisplayStartTime && millis() - titleDisplayStartTime >= 1000) {
        fill(255); // 흰색 텍스트
        textSize(130);
        textAlign(CENTER, CENTER);
        let textLines = ["Please", "More", "Information"];
        let yPosition = height * (2 / 7);
        let lineHeight = textSize() * 0.9;
        let xOffset = 30; // 오른쪽으로 밀기 위한 오프셋 값

        for (let i = 0; i < textLines.length; i++) {
            let line = textLines[i];
            let xPosition = width / 2 - textWidth(line) / 2 + xOffset;

            for (let j = 0; j < line.length; j++) {
                let c = line.charAt(j);

                // 'P', 'M', 'I'는 노란색, 나머지는 흰색
                if (c === 'P' || c === 'M' || c === 'I') {
                    fill(255, 255, 0); // 노란색
                } else {
                    fill(255); // 흰색
                }

                text(c, xPosition, yPosition + i * lineHeight);
                xPosition += textWidth(c);
            }
        }

        if (!titleCompleted) {
            titleCompleted = true;
            titleCompletedStartTime = millis(); // 현재 시간을 저장
        }
    }

    // 텍스트가 모두 표시된 후 1.5초 딜레이 후 시작 버튼 그리기
    if (titleCompleted && millis() - titleCompletedStartTime >= 1500) {
        noFill();
        stroke(255);
        strokeWeight(5);
        rectMode(CENTER);
        let x1 = width / 2;
        let y1 = 760;
        let w1 = 500;
        let h1 = 100;
        let w2 = 450;
        let h2 = 70;

        // 외부
        rect(x1, y1, w1, h1);
        // 내부
        rect(x1, y1, w2, h2);

        let rect1 = [
            [x1 - w1 / 2, y1 - h1 / 2], // 왼쪽 상단
            [x1 + w1 / 2, y1 - h1 / 2], // 오른쪽 상단
            [x1 + w1 / 2, y1 + h1 / 2], // 오른쪽 하단
            [x1 - w1 / 2, y1 + h1 / 2]  // 왼쪽 하단
        ];

        let rect2 = [
            [x1 - w2 / 2, y1 - h2 / 2], // 왼쪽 상단
            [x1 + w2 / 2, y1 - h2 / 2], // 오른쪽 상단
            [x1 + w2 / 2, y1 + h2 / 2], // 오른쪽 하단
            [x1 - w2 / 2, y1 + h2 / 2]  // 왼쪽 하단
        ];

        // 네 꼭짓점을 연결하는 선 그리기
        for (let i = 0; i < 4; i++) {
            line(rect1[i][0], rect1[i][1], rect2[i][0], rect2[i][1]);
        }

        // 시작 text
        noStroke();
        textSize(40);
        textAlign(CENTER, CENTER);
        fill(255, 200);
        text("'SPACE BAR'를 누르세요!", x1, y1 + 95)

        if (frameCount % 60 < 30) {
            fill(0);
        } else {
            fill(255);
        }
        textSize(50);
        text("START", x1, y1 - 5);

        startButtonVisible = true; // 시작 버튼이 보이는 상태로 설정
    }
}

function drawMain1() {
    background(mainBG);

    textSize(45);
    fill(255);
    textAlign(CORNER, CORNER);
    text("요즘 바람이의 관심사는 무엇일까?", 800, 830);

    // 폰 터치 영역
    fill(255);
    rectMode(CORNER);
    rect(255, 150, 422, 830);

    // 폰 버튼 영역
    fill(120, 120, 120);
    rect(680, 320, 37, 90);

    input.position(800, 850); // 캔버스 기준으로 위치 설정
    input.show(); // main1에서 input 필드 표시

    // 메시지 표시
    textSize(32);
    fill(255, 150);
    textAlign(CORNER, CORNER);
    text(message, 800, 920); // 입력 필드 아래에 메시지 표시
}

function handleInput() {
    userInput = input.value().toLowerCase().replace(/\s/g, ''); // 입력 필드의 값을 소문자로 변환하고 공백 제거하여 저장

    // 현재 스테이지의 정답 단어와 비교
    if (correctWords.map(word => word.replace(/\s/g, '')).includes(userInput)) {
        stateNow = 'ending';
        message = ''; // 메시지 초기화
    } else {
        message = '아니야. 다시 생각해보자.'; // 오답 메시지 표시
        setTimeout(() => {
            message = ''; // 2초 후에 메시지 지우기
        }, 2000);
    }
    input.value(''); // 입력 필드 초기화
}

function drawEnding() {
    background(0);
}
