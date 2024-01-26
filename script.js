// vars
const allPrizes = [
  {
    text: "Abdullah",
    color: "#F64C18",
  },
  {
    text: "Yang",
    color: "#E8571D",
  },
  {
    text: "Limin",
    color: "#DA6122",
  },
  {
    text: "Jason",
    color: "#A18C37",
  },
  {
    text: "Adam",
    color: "#84A142",
  },
  {
    text: "Ming",
    color: "#2FE161",
  },
];
// wheel
let exclude = [];
let prizeSlice;
let prizeOffset;
let isSpinning = false;
let prizes = allPrizes.filter((prize) => !exclude.includes(prize.text));

// animation
let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let prizeNodes;

// elements
const excludeInput = document.querySelector("#exclude-input");
const excludeButton = document.querySelector("#exclude-submit");
const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".cap");
const ticker = wheel.querySelector(".ticker");
const reaper = wheel.querySelector(".grim-reaper");

// styles
const spinClass = "is-spinning";
const selectedClass = "selected";
const spinnerStyles = window.getComputedStyle(spinner);

const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// event listenlers.
excludeButton.addEventListener("click", () => {
  isSpinning = false;
  exclude = [];
  const options = (excludeInput && excludeInput.options) ?? [];
  for (var i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      exclude.push(opt.value);
    }
  }
  console.log(exclude);

  setupWheel();
});

trigger.addEventListener("click", () => {
  if (isSpinning) {
    return;
  }
  trigger.disabled = true;
  isSpinning = true;
  rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
  console.log(rotation);
  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  ticker.style.animation = "none";
  runTickerAnimation();
});

spinner.addEventListener("transitionend", () => {
  cancelAnimationFrame(tickerAnim);
  trigger.disabled = false;
  trigger.focus();
  rotation %= 360;
  selectPrize();
  wheel.classList.remove(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  isSpinning = false;
});

// functions
// seting up wheel
const calculateSlices = () => {
  prizes = allPrizes.filter((prize) => !exclude.includes(prize.text));
  prizeSlice = 360 / prizes.length;
  prizeOffset = Math.floor(180 / prizes.length);
};

const createPrizeNodes = () => {
  // clear existing nodes.
  const existingPrizes = document.querySelectorAll(".prize");
  existingPrizes.forEach((el) => el.remove());

  prizes.forEach(({ text }, i) => {
    const rotation = prizeSlice * i * -1 - prizeOffset;
    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize" style="--rotate: ${rotation}deg">
        <span class="text">${text}</span>
      </li>`
    );
  });
};

const createConicGradient = () => {
  // clear existing styles.
  spinner.removeAttribute("style");

  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from -90deg,
      ${prizes
        .map(
          ({ color }, i) =>
            `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`
        )
        .reverse()}
    );`
  );
};

const setupWheel = () => {
  calculateSlices();
  createConicGradient();
  createPrizeNodes();
  prizeNodes = wheel.querySelectorAll(".prize");
};

// spin the wheel
const runTickerAnimation = () => {
  // https://css-tricks.com/get-value-of-css-rotation-through-javascript/
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);

  if (rad < 0) rad += 2 * Math.PI;

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.style.animation = "none";
    setTimeout(() => (ticker.style.animation = null), 10);
    currentSlice = slice;
  }

  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

const selectPrize = () => {
  const selected = Math.floor(rotation / prizeSlice);
  prizeNodes[selected].classList.add(selectedClass);
};

setupWheel();
