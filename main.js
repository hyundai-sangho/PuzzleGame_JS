// 동적인 실행에 필요한 각각의 변수 설정(시작 버튼, 플레이 시간 등등)
const container = document.querySelector(".image-container");
const startButton = document.querySelector(".start-button");
const restartButton = document.querySelector(".restart-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");

const tileCount = 16;

let tiles = [];

const dragged = {
  el: null,
  class: null,
  index: null,
};

let isPlaying = false;
let timeInterval = null;
let time = 0;

/* 함수 시작 ================================================================= */
/* =========================================================================== */

// 퍼즐이 원래 사진 위치에 맞는지 매칭을 체크해주는 함수
function checkStatus() {
  const currentList = [...container.children];
  const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index);

  if (unMatchedList.length === 0) {
    // 게임 종료
    gameText.style.display = "block";
    isPlaying = false;

    clearInterval(timeInterval);

    startButton.style.display = "none";
    restartButton.style.display = "block";

    restartButton.addEventListener("click", () => {
      location.reload();
    });
  }
}

// 게임에 기초 세팅을 해주는 함수
function setGame() {
  isPlaying = true;
  time = 0;
  container.innerHTML = "";
  clearInterval(timeInterval);
  gameText.style.display = "none";

  tiles = createImageTiles();

  if (isPlaying) {
    // 1. 처음엔 기본 사진 퍼즐을 보여주다가
    tiles.forEach((tile) => container.appendChild(tile));

    // 2. 2초 뒤에 랜덤으로 섞인 사진 퍼즐을 보여줌
    // shuffle 함수로 사진 타일을 섞고 forEach로 돌려서
    // 돌아가면서 나오는 각각의 타일 요소 16개를 ul태그에 appendChild 함수로
    // 하나하나씩 붙여서 랜덤으로 뒤섞인 큰 사진 1개를 만들어줌.
    setTimeout(() => {
      container.innerHTML = "";
      shuffle(tiles).forEach((tile) => container.appendChild(tile));

      timeInterval = setInterval(() => {
        playTime.innerText = time;
        time++;
      }, 1000);
    }, 5000);
  }
}

// 사진 타일 16개를 만들어주는 함수
function createImageTiles() {
  const tempArray = [];

  // li 태그 16개 퍼즐 타일을 만들고 그 안에 class를 list1, list2, list3과 같은 식으로
  // 붙여줌으로써 style.css에서 생성해놓은 스타일이 적용돼서 화면에는
  // 16개의 퍼즐 조각이 1개의 큰 사진으로 보여지도록 구성
  Array(tileCount)
    .fill()
    .forEach((_, i) => {
      // 콜백 함수 내에 (_, i)를 사용하는 이유는
      // 파라미터 1번째 값은 요소 값이 들어가고
      // 2번째 파라미터는 인덱스 값을 지칭하는데
      // 지금 같은 상황에서는 1번째 파라미터인
      // 요소 값은 필요가 없고 인덱스 값만 필요하기 때문에
      // 1번째 파라미터로 들어오는 값은 사용하지 않는다는 의미에서
      // _ 언더바 표시로 처리함.

      const li = document.createElement("li");
      li.setAttribute("data-index", i);
      li.setAttribute("draggable", "true");
      li.classList.add(`list${i}`);
      tempArray.push(li);
    });

  return tempArray;
}

// 사진 퍼즐 타일을 섞어주는 함수
function shuffle(array) {
  let index = array.length - 1;

  while (index > 0) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    index--;
  }

  return array;
}

/* 함수 끝 ================================================================= */
/* =========================================================================== */

/* 이벤트 시작 */
/* =========================================================================== */
container.addEventListener("dragstart", (e) => {
  if (!isPlaying) return;

  const obj = e.target;

  dragged.el = obj;
  dragged.class = obj;
  dragged.index = [...obj.parentNode.children].indexOf(obj);
});

container.addEventListener("dragover", (e) => {
  e.preventDefault();
});

container.addEventListener("drop", (e) => {
  if (!isPlaying) return;

  const obj = e.target;

  if (obj.className !== dragged.class) {
    let originPlace;
    let isLast = false;

    if (dragged.el.nextSibling) {
      originPlace = dragged.el.nextSibling;
    } else {
      originPlace = dragged.el.previousSibling;
      isLast = true;
    }

    const droppedIndex = [...obj.parentNode.children].indexOf(obj);
    dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);

    isLast ? originPlace.after(obj) : originPlace.before(obj);
  }
  checkStatus();
});

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  setGame();
});
/* 이벤트 끝 */
/* =========================================================================== */
