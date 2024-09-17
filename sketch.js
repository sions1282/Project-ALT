// 전역 변수들
let customFont;
let stateNow = 'loading';
let titleBG, mainBG, mainBG02, mainBG03, mainBG04, endingBG, story01, story02, story03, story04, story05, like;
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
let correctWords = ["기타", "기타연주", "기타연주하기", "guitar"];
let input;
let message = '';
let phoneTouchCount = 0; // 폰 터치 횟수
let lastPhoneTouchTime = 0; // 마지막 폰 터치 시간
let buttonClickCount = 0; // 버튼 클릭 횟수
let buttonClickTimes = []; // 버튼 클릭 시간 배열

let c_displayText1 = false;
let c_displayText2 = false;

let voiceOver1 = false;
let voiceOver2 = false;
let voiceOver3 = false;
let voiceOver4 = false;
let voiceOver5 = false;
let voiceOver6 = false;
let voiceOver7 = false;
let voiceOver8 = false;
let voiceOver9 = false;
let voiceOver10 = false;
let voiceOver11 = false;
let voiceOver12 = false;
let voiceOver13 = false;
let voiceOver14 = false;
let voiceOver15 = false;
let voiceOver16 = false;
let voiceOver17 = false;
let voiceOver18 = false;
let imgCount = 0;
let lastClickTime1 = 0;

// 추가 변수
let lastClickTime7 = 0;
let likeVisible = false;

// ending 변수
let alpha = 0;
let titleDisplayTime = null;

function preload() {
    // 폰트, 이미지, 사운드 프리로드
    customFont = loadFont('DungGeunMo.ttf');
    story01 = loadImage('asset/story1.png');
    story02 = loadImage('asset/story2.png');
    story03 = loadImage('asset/story3.png');
    story04 = loadImage('asset/story4.png');
    titleBG = loadImage('asset/screenshot.png');
    mainBG = loadImage('asset/mainbg.png');
    mainBG02 = loadImage('asset/mainbg02.png');
    mainBG03 = loadImage('asset/mainbg03.png');
    mainBG04 = loadImage('asset/mainbg04.png');
    story05 = loadImage('asset/story5.png');
    endingBG = loadImage('asset/screenshot2.png');
    like = loadImage('asset/like.png');
}

function setup() {
    let canvas = createCanvas(1920, 1080);
    canvas.parent('p5-doms');
    textFont(customFont);
    updateTitleContent();

    input = createInput();
    input.size(400, 30); // 입력 필드 크기 설정
    input.class('customInput'); // 클래스 추가
    input.attribute('placeholder', '정답을 입력하세요.'); // 플레이스홀더 추가
    input.input(onInputEvent); // input 이벤트 리스너 추가
    input.hide(); // 처음엔 숨김

    updateInputPosition();
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
            input.show();
            break;
        case 'main2':
            drawMain2();
            input.show();
            break;
        case 'main3':
            drawMain3();
            input.show();
            break;
        case 'main4':
            drawMain4();
            input.show();
            break;
        case 'preending':
            drawpreEnding();
            input.hide();
            break;
        case 'ending':
            drawEnding();
            input.hide();
            break;
    }
}

function keyPressed() {
    // if (key === 'f') {
    //     let fs = fullscreen();
    //     fullscreen(!fs);
    // }

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
            handleInput();
        } else if (stateNow === 'main2') {
            handleInput();
        } else if (stateNow === 'main3') {
            handleInput();
        } else if (stateNow === 'main4') {
            handleInput();
        } else if (stateNow === 'preending' && textCompleted) {
            stateNow = 'ending';
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
        if (stateNow === 'preending' && !textCompleted) {
            displayedText = fullText; // 모든 텍스트를 한 번에 표시
            charIndex = fullText.length;
            textCompleted = true;
            enterButtonVisible = true; // 엔터 버튼 표시 설정
        }
    }

    // // s를 누르면 스크린샷
    // if (key === 's') {
    //     saveCanvas('screenshot', 'png');
    // }
}

function mousePressed() {
    // 폰 터치 영역
    if (stateNow === 'main1' && mouseX > 255 && mouseX < 677 && mouseY > 150 && mouseY < 980) {
        phoneTouchCount++;
        lastPhoneTouchTime = millis();

        if (phoneTouchCount === 1) {
            c_displayText1 = true;
        } else if (phoneTouchCount >= 3) {
            c_displayText2 = true;
            phoneTouchCount = 0; // 초기화
        }
    }

    // 폰 버튼 영역
    if (stateNow === 'main1' && mouseX > 680 && mouseX < 717 && mouseY > 320 && mouseY < 410) {
        let currentTime = millis();
        buttonClickTimes.push(currentTime);

        // 클릭 시간 배열에서 500ms 이내의 클릭만 남김
        buttonClickTimes = buttonClickTimes.filter(time => currentTime - time < 500);

        if (buttonClickTimes.length >= 3) {
            stateNow = 'main2';
        }
    }

    if (stateNow === 'main2' && imgCount >= 1 && mouseX > 1595 && mouseX < 1657 && mouseY > 425 && mouseY < 485) {
        stateNow = 'main3';
    }

    // 1번 인스타그램 영역
    if (stateNow === 'main2' && mouseX > 263 && mouseX < 470 && mouseY > 169 && mouseY < 220) {
        voiceOver1 = true; // 1번 영역
        setTimeout(() => {
            voiceOver1 = false;
        }, 2500); // 2.5초 후에 false로 설정
    }

    if (stateNow === 'main2' && mouseX > 550 && mouseX < 605 && mouseY > 167 && mouseY < 217) {
        voiceOver2 = true; // 2번 영역
        setTimeout(() => {
            voiceOver2 = false;
        }, 1500);
    }

    if (stateNow === 'main2' && mouseX > 626 && mouseX < 681 && mouseY > 163 && mouseY < 213) {
        voiceOver3 = true; // 3번 영역
        setTimeout(() => {
            voiceOver3 = false;
        }, 1500);
    }

    if (stateNow === 'main2' && mouseX > 265 && mouseX < 665 && mouseY > 226 && mouseY < 306) {
        voiceOver4 = true; // 4번 영역
        setTimeout(() => {
            voiceOver4 = false;
        }, 2000); // 2초 후에 false로 설정
    }

    if (stateNow === 'main2' && mouseX > 265 && mouseX < 665 && mouseY > 312 && mouseY < 372) {
        voiceOver5 = true; // 5번 영역
        setTimeout(() => {
            voiceOver5 = false;
        }, 1500);
    }

    if (stateNow === 'main2' && mouseX > 265 && mouseX < 675 && mouseY > 387 && mouseY < 797) {
        imgCount++;
        voiceOver6 = true; // 6번 영역
        setTimeout(() => {
            voiceOver6 = false;
        }, 5000); // 5초 후에 false로 설정
    }

    if (stateNow === 'main2' && mouseX > 265 && mouseX < 320 && mouseY > 800 && mouseY < 850) {
        voiceOver7 = true; // 7번 영역
        setTimeout(() => {
            voiceOver7 = false;
        }, 1500);
    }

    if (stateNow === 'main2' && mouseX > 330 && mouseX < 385 && mouseY > 800 && mouseY < 850) {
        voiceOver8 = true; // 8번 영역
        setTimeout(() => {
            voiceOver8 = false;
        }, 1500);
    }

    if (stateNow === 'main2' && mouseX > 390 && mouseX < 445 && mouseY > 800 && mouseY < 850) {
        voiceOver9 = true; // 9번 영역
        setTimeout(() => {
            voiceOver9 = false;
        }, 1500);
    }

    if (stateNow === 'main2' && mouseX > 617 && mouseX < 672 && mouseY > 800 && mouseY < 850) {
        voiceOver10 = true; // 10번 영역
        setTimeout(() => {
            voiceOver10 = false;
        }, 1500);
    }

    if (stateNow === 'main2' && mouseX > 265 && mouseX < 665 && mouseY > 864 && mouseY < 924) {
        voiceOver11 = true; // 11번 영역
        setTimeout(() => {
            voiceOver11 = false;
        }, 2500); // 2.5초 후에 false로 설정
    }

    if (stateNow === 'main2' && mouseX > 265 && mouseX < 320 && mouseY > 940 && mouseY < 990) {
        voiceOver12 = true; // 12번 영역
        setTimeout(() => {
            voiceOver12 = false;
        }, 1500);
    }

    if (stateNow === 'main2' && mouseX > 348 && mouseX < 403 && mouseY > 940 && mouseY < 990) {
        voiceOver13 = true; // 13번 영역
        setTimeout(() => {
            voiceOver13 = false;
        }, 1500);
    }

    if (stateNow === 'main2' && mouseX > 444 && mouseX < 499 && mouseY > 940 && mouseY < 990) {
        voiceOver14 = true; // 14번 영역
        setTimeout(() => {
            voiceOver14 = false;
        }, 1500);
    }

    if (stateNow === 'main2' && mouseX > 531 && mouseX < 586 && mouseY > 940 && mouseY < 990) {
        voiceOver15 = true; // 15번 영역
        setTimeout(() => {
            voiceOver15 = false;
        }, 1500);
    }

    if (stateNow === 'main2' && mouseX > 616 && mouseX < 671 && mouseY > 940 && mouseY < 990) {
        voiceOver16 = true; // 16번 영역
        setTimeout(() => {
            voiceOver16 = false;
        }, 1500);
    }

    // main3 관련
    let currentTime = millis();
    if (stateNow === 'main3' && mouseX > 263 && mouseX < 470 && mouseY > 169 && mouseY < 220) {
        if (currentTime - lastClickTime1 < 300) { // 두 번째 클릭이 300ms 이내에 발생했을 때
            stateNow = 'main4';
        } else {
            voiceOver1 = true; // 1번 영역
            setTimeout(() => {
                voiceOver1 = false;
            }, 2500); // 2.5초 후에 false로 설정
        }
        lastClickTime1 = currentTime; // 마지막 클릭 시간 업데이트
    }

    if (stateNow === 'main3' && mouseX > 550 && mouseX < 605 && mouseY > 167 && mouseY < 217) {
        voiceOver2 = true; // 2번 영역
        setTimeout(() => {
            voiceOver2 = false;
        }, 1500);
    }

    if (stateNow === 'main3' && mouseX > 626 && mouseX < 681 && mouseY > 163 && mouseY < 213) {
        voiceOver3 = true; // 3번 영역
        setTimeout(() => {
            voiceOver3 = false;
        }, 1500);
    }

    if (stateNow === 'main3' && mouseX > 265 && mouseX < 665 && mouseY > 226 && mouseY < 306) {
        voiceOver4 = true; // 4번 영역
        setTimeout(() => {
            voiceOver4 = false;
        }, 2000); // 2초 후에 false로 설정
    }

    if (stateNow === 'main3' && mouseX > 265 && mouseX < 665 && mouseY > 312 && mouseY < 372) {
        voiceOver5 = true; // 5번 영역
        setTimeout(() => {
            voiceOver5 = false;
        }, 1500);
    }

    if (stateNow === 'main3' && mouseX > 265 && mouseX < 675 && mouseY > 387 && mouseY < 797) {
        voiceOver17 = true; // 6번 영역
        setTimeout(() => {
            voiceOver17 = false;
        }, 5000); // 5초 후에 false로 설정
    }

    if (stateNow === 'main3' && mouseX > 265 && mouseX < 320 && mouseY > 800 && mouseY < 850) {
        voiceOver7 = true; // 7번 영역
        setTimeout(() => {
            voiceOver7 = false;
        }, 1500);
    }

    if (stateNow === 'main3' && mouseX > 330 && mouseX < 385 && mouseY > 800 && mouseY < 850) {
        voiceOver8 = true; // 8번 영역
        setTimeout(() => {
            voiceOver8 = false;
        }, 1500);
    }

    if (stateNow === 'main3' && mouseX > 390 && mouseX < 445 && mouseY > 800 && mouseY < 850) {
        voiceOver9 = true; // 9번 영역
        setTimeout(() => {
            voiceOver9 = false;
        }, 1500);
    }

    if (stateNow === 'main3' && mouseX > 617 && mouseX < 672 && mouseY > 800 && mouseY < 850) {
        voiceOver10 = true; // 10번 영역
        setTimeout(() => {
            voiceOver10 = false;
        }, 1500);
    }

    if (stateNow === 'main3' && mouseX > 265 && mouseX < 665 && mouseY > 864 && mouseY < 924) {
        voiceOver11 = true; // 11번 영역
        setTimeout(() => {
            voiceOver11 = false;
        }, 2500); // 2.5초 후에 false로 설정
    }

    if (stateNow === 'main3' && mouseX > 265 && mouseX < 320 && mouseY > 940 && mouseY < 990) {
        voiceOver12 = true; // 12번 영역
        setTimeout(() => {
            voiceOver12 = false;
        }, 1500);
    }

    if (stateNow === 'main3' && mouseX > 348 && mouseX < 403 && mouseY > 940 && mouseY < 990) {
        voiceOver13 = true; // 13번 영역
        setTimeout(() => {
            voiceOver13 = false;
        }, 1500);
    }

    if (stateNow === 'main3' && mouseX > 444 && mouseX < 499 && mouseY > 940 && mouseY < 990) {
        voiceOver14 = true; // 14번 영역
        setTimeout(() => {
            voiceOver14 = false;
        }, 1500);
    }

    if (stateNow === 'main3' && mouseX > 531 && mouseX < 586 && mouseY > 940 && mouseY < 990) {
        voiceOver15 = true; // 15번 영역
        setTimeout(() => {
            voiceOver15 = false;
        }, 1500);
    }

    if (stateNow === 'main3' && mouseX > 616 && mouseX < 671 && mouseY > 940 && mouseY < 990) {
        voiceOver16 = true; // 16번 영역
        setTimeout(() => {
            voiceOver16 = false;
        }, 1500);
    }

    // main4 관련
    if (stateNow === 'main4' && mouseX > 265 && mouseX < 665 && mouseY > 312 && mouseY < 372) {
        voiceOver5 = true; // 5번 영역
        setTimeout(() => {
            voiceOver5 = false;
        }, 2000); // 2초 후에 false로 설정
    }

    if (stateNow === 'main4' && mouseX > 265 && mouseX < 675 && mouseY > 387 && mouseY < 797) {
        voiceOver18 = true; // 6번 영역
        setTimeout(() => {
            voiceOver18 = false;
        }, 10000); // 10초 후에 false로 설정
    }

    if (stateNow === 'main4' && mouseX > 265 && mouseX < 320 && mouseY > 800 && mouseY < 850) {
        let currentTime = millis();
        if (currentTime - lastClickTime7 < 300) { // 두 번째 클릭이 300ms 이내에 발생했을 때
            likeVisible = true;
        } else {
            voiceOver7 = true; // 7번 영역
            setTimeout(() => {
                voiceOver7 = false;
            }, 2500); // 2.5초 후에 false로 설정
        }
        lastClickTime7 = currentTime; // 마지막 클릭 시간 업데이트
    }

    if (stateNow === 'ending') {
        // 첫 번째 사각형 그룹 클릭 영역
        if (mouseX > (width / 2) - 250 && mouseX < (width / 2) + 250 && mouseY > 510 && mouseY < 610) {
            window.open('https://sions.notion.site/Project-ALT-de93e8a123524d1f8b117b4d8957dc47?pvs=4', '_blank');
        }
        // 두 번째 사각형 그룹 클릭 영역
        if (mouseX > (width / 2) - 250 && mouseX < (width / 2) + 250 && mouseY > 710 && mouseY < 810) {
            window.open('https://sions.notion.site/PMI-Please-More-Information-TMI-e428b020853b4c07a2b065ebc175666c?pvs=4', '_blank');
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

    textSize(25);
    fill(255);
    textAlign(LEFT, TOP);
    text("'마우스'로 터치하세요!", 329, 1030);

    textSize(45);
    fill(255);
    textAlign(LEFT, TOP);
    text("요즘 바람이의 관심사는 무엇일까?", 800, 860);

    textSize(30);
    fill(255, 150);
    text("정답 입력 후 [ENTER]", 1245, 925);

    if (c_displayText1) {
        displayText1();
    }

    if (c_displayText2) {
        displayText2();
    }

    updateInputPosition(); // main1에서 input 필드 위치 업데이트 및 표시

    // 메시지 표시
    textSize(32);
    fill(255, 200);
    textAlign(LEFT, TOP);
    text(message, 800, 975); // 입력 필드 아래에 메시지 표시

}

function displayText1() {
    fill(255, 255, 0); // 노란색 rect
    rectMode(CORNER);
    rect(790, 150, 1020, 110, 15);
    fill(0); // 검정색 텍스트
    textAlign(LEFT, TOP);
    textSize(35);
    text("이런! 인스타엔 접속했는데 실수로 VoiceOver를 꺼버렸잖아?\n이러면 인스타를 확인할 수 없지. 빨리 켜야겠어.", 810, 165);
}

function displayText2() {
    fill(255, 255, 0); // 노란색 rect
    rectMode(CORNER);
    rect(790, 150, 1020, 160, 15);
    fill(0); // 검정색 텍스트
    textAlign(LEFT, TOP);
    textSize(35);
    text("나 혼자 설정탭을 찾기는 어려울 것 같고…\n단축키로 활성화시켜야겠네.\n스마트폰의 우측 측면 버튼을 빠르게 3번 누르는 거였지?", 810, 165);
}

function drawMain2() {
    background(mainBG02);

    textSize(25);
    fill(255);
    textAlign(LEFT, TOP);
    text("'마우스'로 터치하세요!", 329, 1030);

    textSize(45);
    fill(255);
    textAlign(LEFT, TOP);
    text("요즘 바람이의 관심사는 무엇일까?", 800, 860);

    textSize(30);
    fill(255, 150);
    text("정답 입력 후 [ENTER]", 1245, 925);

    // 오답 메시지 표시
    textSize(32);
    fill(255, 200);
    textAlign(LEFT, TOP);
    text(message, 800, 975);

    voiceOver("VoiceOver를 켭니다.\nVoiceOver는 화면 상에 있는 항목을 말합니다.\n항목을 선택하려면 한 번 탭하십시오.");
    ment("좋아. VoiceOver가 켜지니까 낫네.", 60);

    // 구역1
    if (voiceOver1) {
        voiceOver("인스타그램 기본 피드 버튼 머리말\n두 번 눌러 피드를 새로 고치세요.");
    }

    if (voiceOver2) {
        voiceOver("알림 버튼"); // 2번 영역
    }

    if (voiceOver3) {
        voiceOver("다이렉트 메시지 버튼"); // 3번 영역
    }

    if (voiceOver4) {
        voiceOver("스토리 트레이 내 스토리 1/5"); // 4번 영역
        ment("인스타 스토리는 VoiceOver로 확인할 수 없어...", 60);
    }

    if (voiceOver5) {
        voiceOver("게시자 wind_wish님 일시 7시간 전"); // 5번 영역
    }

    if (voiceOver6) {
        voiceOver("wind_wish님의 사진 좋아요 7개 댓글 5개"); // 6번 영역
        ment("사진을 사진이라고만 읽어주다니, 가장 중요한 정보를\n알 수 없잖아? 대체 텍스트가 달려있었으면 좋았을텐데…\n대신 VoiceOver의 이미지 설명 기능이라도 켜볼까?", 160);
    }

    if (imgCount >= 1) {
        noFill();
        stroke(255);
        strokeWeight(7);
        rectMode(CORNER);
        rect(790, 340, 1020, 230, 15);
        noStroke();

        fill(255);
        textAlign(LEFT, TOP);
        textSize(45);
        text("VoiceOver 인식", 1130, 355);

        rect(850, 415, 905, 80, 10);

        fill(0);
        text("이미지 설명", 860, 428);

        fill(174, 174, 174);
        rect(1590, 422, 150, 67, 25);

        fill(255);
        rect(1595, 425, 62, 60, 30);
        textSize(30);
        text("iPhone이 앱 및 웹 사이트상에 있는 이미지를 설명합니다.", 852, 507);
    }

    if (voiceOver7) {
        voiceOver("좋아요 버튼"); // 7번 영역
    }

    if (voiceOver8) {
        voiceOver("댓글 달기 버튼"); // 8번 영역
    }

    if (voiceOver9) {
        voiceOver("보내기 버튼"); // 9번 영역
    }

    if (voiceOver10) {
        voiceOver("저장 버튼"); // 10번 영역
    }

    if (voiceOver11) {
        voiceOver("wind_wish 요즘 내 취미"); // 11번 영역
        ment("바람이의 취미라고?\n사진 내용을 알아내서 도움이 되는 물건을 선물해야겠어!", 120);
    }

    if (voiceOver12) {
        voiceOver("기본 피드 탭 총 5개 중 첫 번째"); // 12번 영역
    }

    if (voiceOver13) {
        voiceOver("탐색 탭 총 5개 중 두 번째"); // 13번 영역
    }

    if (voiceOver14) {
        voiceOver("카메라 열기 탭 총 5개 중 세 번째"); // 14번 영역
    }

    if (voiceOver15) {
        voiceOver("릴스 탭 총 5개 중 네 번째"); // 15번 영역
    }

    if (voiceOver16) {
        voiceOver("선택된 프로필 탭 총 5개 중 다섯 번째"); // 16번 영역
    }

    updateInputPosition();
}

function voiceOver(voice) {
    fill(148, 16, 20); // 빨간색 rect
    rectMode(CORNER);
    rect(790, 600, 1020, 230, 15);
    fill(255);
    textAlign(LEFT, TOP);
    textSize(45);
    text("VoiceOver", 805, 608);

    fill(0);
    rectMode(CORNER);
    rect(804, 668, 996, 147, 15);
    fill(255);
    textAlign(LEFT, TOP);
    textSize(35);
    text(voice, 820, 680);
}

function ment(ment, y) {
    fill(255, 255, 0);
    rectMode(CORNER);
    rect(790, 150, 1020, y, 15);
    fill(0); // 검정색 텍스트
    textAlign(LEFT, TOP);
    textSize(35);
    text(ment, 810, 165);
}

function drawMain3() {
    background(mainBG03);

    textSize(25);
    fill(255);
    textAlign(LEFT, TOP);
    text("'마우스'로 터치하세요!", 329, 1030);

    textSize(45);
    fill(255);
    textAlign(LEFT, TOP);
    text("요즘 바람이의 관심사는 무엇일까?", 800, 860);

    textSize(30);
    fill(255, 150);
    text("정답 입력 후 [ENTER]", 1245, 925);

    // 오답 메시지 표시
    textSize(32);
    fill(255, 200);
    textAlign(LEFT, TOP);
    text(message, 800, 975);
    updateInputPosition();

    voiceOver("VoiceOver 인식, 이미지 설명 켬.\niPhone이 기기에 탑재된 지능형 기능을 사용하여 자동으로\n앱, 이미지 및 텍스트를 더 사용하기 쉽게 만듭니다.");
    ment("이미지 설명을 켜면 사진이 얼마나 잘 읽힐까?", 60);

    // 구역1
    if (voiceOver1) {
        voiceOver("인스타그램 기본 피드 버튼 머리말\n두 번 눌러 피드를 새로 고치세요.");
    }

    if (voiceOver2) {
        voiceOver("알림 버튼"); // 2번 영역
    }

    if (voiceOver3) {
        voiceOver("다이렉트 메시지 버튼"); // 3번 영역
    }

    if (voiceOver4) {
        voiceOver("스토리 트레이 내 스토리 1/5"); // 4번 영역
        ment("이미지 설명을 켜도 스토리 이미지는 어차피 안 읽힌대...", 60);
    }

    if (voiceOver5) {
        voiceOver("게시자 wind_wish님 일시 7시간 전"); // 5번 영역
    }

    if (voiceOver17) {
        voiceOver("wind_wish님의 사진\n책 기타 동물 및 캐릭터의 이미지일 수 있음\n좋아요 7개 댓글 5개"); // 6번 영역
        ment("책이랑 동물? 웹툰이라도 보나?\n아까보단 낫지만 AI가 얼마나 제대로 분석했을지...\n이것으로는 바람이의 취미를 확신할 수 없어.\n정보가 더 있으면 좋을텐데… 새로고침을 해볼까?", 190);
    }

    if (voiceOver7) {
        voiceOver("좋아요 버튼"); // 7번 영역
    }

    if (voiceOver8) {
        voiceOver("댓글 달기 버튼"); // 8번 영역
    }

    if (voiceOver9) {
        voiceOver("보내기 버튼"); // 9번 영역
    }

    if (voiceOver10) {
        voiceOver("저장 버튼"); // 10번 영역
    }

    if (voiceOver11) {
        voiceOver("wind_wish 요즘 내 취미"); // 11번 영역
        ment("설명이 조금 더 많았더라면 좋았을텐데... 어쩔 수 없지!", 60);
    }

    if (voiceOver12) {
        voiceOver("기본 피드 탭 총 5개 중 첫 번째"); // 12번 영역
    }

    if (voiceOver13) {
        voiceOver("탐색 탭 총 5개 중 두 번째"); // 13번 영역
    }

    if (voiceOver14) {
        voiceOver("카메라 열기 탭 총 5개 중 세 번째"); // 14번 영역
    }

    if (voiceOver15) {
        voiceOver("릴스 탭 총 5개 중 네 번째"); // 15번 영역
    }

    if (voiceOver16) {
        voiceOver("선택된 프로필 탭 총 5개 중 다섯 번째"); // 16번 영역
    }

}

function drawMain4() {
    background(mainBG04);

    textSize(25);
    fill(255);
    textAlign(LEFT, TOP);
    text("'마우스'로 터치하세요!", 329, 1030);

    textSize(45);
    fill(255);
    textAlign(LEFT, TOP);
    text("요즘 바람이의 관심사는 무엇일까?", 800, 860);

    textSize(30);
    fill(255, 150);
    text("정답 입력 후 [ENTER]", 1245, 925);

    // 오답 메시지 표시
    textSize(32);
    fill(255, 200);
    textAlign(LEFT, TOP);
    text(message, 800, 975);
    updateInputPosition();

    voiceOver(" ");
    ment("어라, 바람이가 게시물을 수정했잖아?", 60);

    if (voiceOver5) {
        voiceOver("게시자 wind_wish님 일시 7시간 전 수정됨"); // 5번 영역
    }

    if (voiceOver18) {
        voiceOver("wind_wish님의 사진. 통기타와 악보. 악보는 응원가이고,\n기타에는 호이와 다로 캐릭터 스티커가 붙어 있다.\n이미지 책 기타 동물 및 캐릭터의 이미지일 수 있음"); // 6번 영역
        ment("아하, 아까 기타라고 나온 게 악기를 말하는거였구나!\n책은 악보였네. 동물 및 캐릭터는 스티커를 인식한거였구나.\n바람이 요즘 기타에 빠졌나본데?!", 145);
    }

    if (voiceOver7) {
        voiceOver("좋아요 버튼 미디어에 좋아요를 남기려면 두 번 누르세요."); // 7번 영역
    }

    // like 이미지 표시
    if (likeVisible) {
        image(like, 279, 822, 24, 25);
    }

}

function handleInput() {
    userInput = input.value().toLowerCase().replace(/\s/g, ''); // 입력 필드의 값을 소문자로 변환하고 공백 제거하여 저장

    // 현재 스테이지의 정답 단어와 비교
    if (correctWords.map(word => word.replace(/\s/g, '')).includes(userInput)) {
        stateNow = 'preending';
        message = ''; // 메시지 초기화
        resetText(); // 텍스트 애니메이션 초기화
    } else {
        message = '아니야. 다시 생각해보자.'; // 오답 메시지 표시
        setTimeout(() => {
            message = ''; // 2초 후에 메시지 지우기
        }, 2000);
    }
    input.value(''); // 입력 필드 초기화
}

function updateInputPosition() {
    let canvasX = (windowWidth - width) / 2;
    let canvasY = (windowHeight - height) / 2;
    input.position(canvasX + 800, canvasY + 920); // 캔버스 기준으로 위치 설정
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    updateInputPosition();
}

function drawpreEnding() {
    background(0);
    image(story05, (width / 2) - (650 / 2), 100, 650, 650);

    // 텍스트 박스 (색, 아웃라인, 사이즈)
    fill(255, 255, 255, 30);
    stroke(255);
    strokeWeight(3);
    rectMode(CENTER);
    rect(width / 2, 905, width - 220, 200, 20);

    // 텍스트 타이핑 애니메이션
    textAlign(CENTER, CENTER);
    strokeWeight(1);
    fullText = "그래, 바람이는 요즘 기타 연주하는 걸 좋아하나보다.\n그럼 기타 피크와 스트랩을 선물해줘야지.\n바람이가 잘 쓰면 좋겠다!";
    typeText(fullText, width / 2, 900, 35, 255, typingSpeed);

    // 모든 텍스트가 표시된 후 엔터 버튼 즉시 표시
    if (textCompleted && !enterButtonVisible) {
        setTimeout(() => {
            enterButtonVisible = true;
        }, 1000); // 1초 후 엔터 버튼 보이기
    }

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

function drawEnding() {
    background(endingBG);
    noStroke();
    fill(0, 0, 0, alpha); // 검정색 rect 투명도 설정
    rectMode(CORNER);
    rect(0, 0, width, height); // 화면 크기의 rect 그리기

    // 0.1초마다 투명도 30씩 증가
    if (frameCount % 6 === 0 && alpha < 255) {
        alpha += 30;
    }

    if (alpha >= 255 && !titleDisplayTime) {
        titleDisplayTime = millis(); // 현재 시간을 저장
    }

    // 타이머가 1초(1000ms) 경과했을 때 텍스트 표시
    if (titleDisplayTime && millis() - titleDisplayTime >= 1000) {
        fill(255, 255, 0); // 노란색 텍스트
        textSize(160); // "The End" 텍스트 크기
        textAlign(CENTER, CENTER);
        text("The End", width / 2, 230); // y 좌표 330 -> 230으로 변경

        // 그 이후 텍스트
        fill(255);
        textSize(30); // 나머지 텍스트 크기
        text("플레이해주셔서 대단히 감사합니다!\n'마우스'로 클릭하여 웹사이트에 방문하세요.", width / 2, 370); // y 좌표 470 -> 370으로 변경

        // 첫 번째 사각형 그룹
        drawRectangleGroup(width / 2, 560, "Project ALT", "대체 텍스트의 역사와 미래, 실제 사용법을 알아보아요!"); // y 좌표 660 -> 560으로 변경

        // 두 번째 사각형 그룹
        drawRectangleGroup(width / 2, 760, "게임 개발 TMI", "게임 기획 의도 및 TMI가 궁금하다면 놀러오세요!"); // y 좌표 860 -> 760으로 변경
    }
}

function drawRectangleGroup(x1, y1, textLabel, description) {
    noFill();
    stroke(255);
    strokeWeight(5);
    rectMode(CENTER);

    let w1 = 500;
    let h1 = 100;
    let w2 = 450;
    let h2 = 70;

    // 외부 사각형
    rect(x1, y1, w1, h1);
    // 내부 사각형
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

    fill(255);
    noStroke();
    textSize(50);
    textAlign(CENTER, CENTER);
    text(textLabel, x1, y1 - 5);

    // 설명 텍스트 추가
    fill(150); // 회색 텍스트
    textSize(20);
    text(description, x1, y1 + 80); // 사각형 그룹 아래에 텍스트 배치
}



function onInputEvent() {
    if (this.value() === '') {
        this.attribute('placeholder', '정답을 입력하세요.');
    } else {
        this.attribute('placeholder', '');
    }
}