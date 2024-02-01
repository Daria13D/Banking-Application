"use strict";

const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "RUB",
  locale: "pt-PT",
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "es-PE",
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "ru-RU",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let currentAccount;
let timer;

// Вывод на страницу всех приходов и уходов
function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (value, i) {
    const type = value > 0 ? "deposit" : "withdrawal";
    const typeMessage = value > 0 ? "внесение" : "снятие";
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${typeMessage}
          </div>
          <div class="movements__date">24/01/2037</div>
          <div class="movements__value">${value}₽</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}
// Создание логина из ФИО в объекте
function createLogIn(accs) {
  accs.forEach(function (acc) {
    acc.logIn = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (val) {
        return val[0];
      })
      .join("");
  });
}
createLogIn(accounts);

// Подсчет и вывод на страницу общего баланса
function calcPrintBalance(acc) {
  acc.balance = acc.movements.reduce(function (acc, val) {
    return acc + val;
  });
  const options = {
    style: "currency",
    currency: acc.currency,
  };
  //labelBalance.textContent = ${acc.balance} RUB;
  labelBalance.textContent = Intl.NumberFormat(acc.locale, options).format(
    acc.balance
  );
}

//Сумма и вывод на страницу прихода и ухода в footer
function calcDisplaySum(movements) {
  const options = {
    style: "currency",
    currency: currentAccount.currency,
  };
  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = Intl.NumberFormat(
    currentAccount.locale,
    options
  ).format(incomes);

  // labelSumIn.textContent = ${incomes}₽;

  const out = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumOut.textContent = ${Math.abs(out)}₽;
  labelSumOut.textContent = Intl.NumberFormat(
    currentAccount.locale,
    options
  ).format(Math.abs(out));

  //labelSumInterest.textContent = `${incomes + out}₽`;
  labelSumInterest.textContent = Intl.NumberFormat(
    currentAccount.locale,
    options
  ).format(incomes + out);
}

//функция таймера
function startLogOut() {
  let time = 600;
  function tik() {
    const minute = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${minute}:${sec}`;

    if (time == 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
    }
    time--;
  }
  tik();
  const timer = setInterval(tik, 1000);
  return timer;
}

//Обновление интерфейса сайта
function updateUi(acc) {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySum(acc.movements);
}

//Кнопка входа в аккаунт

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Login");
  currentAccount = accounts.find(function (acc) {
    return acc.logIn === inputLoginUsername.value;
  });
  console.log(currentAccount);
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;

    inputLoginPin.value = inputLoginUsername.value = "";

    function timeNow() {
      const local = navigator.language; //получить настройку с нашим местоположением
      const options = {
        //объект для передачи конкретных данных страны (часы и минуты в данном случае)
        hour: "numeric",
        minute: "numeric",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        // weekday: "short",
        second: "numeric",
        // timeZoneName: "long",
        hour12: false,
      };
      labelDate.textContent = Intl.DateTimeFormat(local, options).format(
        new Date()
      );
    }
    setInterval(timeNow, 1);

    if (timer) {
      clearInterval(timer);
    }
    timer = startLogOut();
    updateUi(currentAccount);
  }
});

//Перевод денег на другой аккаунт
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const reciveAcc = accounts.find(function (acc) {
    return acc.logIn === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value);
  console.log(amount, reciveAcc);
  if (
    reciveAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciveAcc.logIn !== currentAccount.logIn
  ) {
    currentAccount.movements.push(-amount);
    reciveAcc.movements.push(amount);
    clearInterval(timer);
    timer = startLogOut();
    updateUi(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = "";
  }
});
//Удаление аккаунта
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.logIn &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.logIn === currentAccount.logIn;
    });
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log(accounts);
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

//Внесение денег на счет
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0) {
    currentAccount.movements.push(amount);
    clearInterval(timer);
    timer = startLogOut();
    updateUi(currentAccount);
  }
  inputLoanAmount.value = "";
});

// Общий баланс длинно
// const accMov = accounts.map(function (acc) {
//   return acc.movements;
// });
// const allMov = accMov.flat();

// const allBalance = allMov.reduce(function (acc, mov) {
//   return acc + mov;
// }, 0);
// console.log(allBalance);

// Общий баланс коротко
const overalBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

//Сортировка по приходам и уходам
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//Изменение значка валюты
labelBalance.addEventListener("click", function () {
  Array.from(document.querySelectorAll(".movements__value"), function (val, i) {
    return (val.innerText = val.textContent.replace("₽", "RUB"));
  });
});

const local = navigator.language; //получить настройку с нашим местоположением
console.log(local);
//даты и время для разных стран
const options = {
  //объект для передачи конкретных данных страны (часы и минуты в данном случае)
  hour: "numeric",
  minute: "numeric",
};
const now = new Date();
const gb = Intl.DateTimeFormat("ar-AE", options).format(now); // прописывается код страны, можно найти на сайте language code table
console.log(gb);

const num = 5758474749;
const options1 = {
  style: "currency",
  currency: "RUB",
};
const ru = Intl.NumberFormat("ru-RU", options1).format(num); //статья INTL в справочнике
const ge = Intl.NumberFormat("de-DE", options1).format(num);
console.log(ru);
console.log(ge);

// if(true){
//   clearTimeout(timer1)
//   clearInterval(timer2)
// }
