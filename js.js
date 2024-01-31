"use strict";

const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    "2024-01-26T21:31:17.178Z",
    "2024-01-26T07:42:02.383Z",
    "2024-01-26T09:15:04.904Z",
    "2024-01-26T10:17:24.185Z",
    "2024-01-01T14:11:59.604Z",
    "2024-01-20T17:01:17.194Z",
    "2024-01-11T23:36:17.929Z",
    "2024-01-12T10:51:36.790Z",
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

function formatMovementDate(date) {
  const calcDayPassed = (date1, date2) => {
    return Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calcDayPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return "Сегодня";
  if (daysPassed === 1) return "Вчера";
  if (daysPassed >= 5) return `Прошло ${daysPassed} дней`;
  if (2 <= daysPassed < 5) return `Прошло ${daysPassed} дня`;
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  return `${day}/${month}/${date.getFullYear()}`;
}

//сумма ухода и прихода
function sumModif(acc) {
  const paymentsPlus = [];
  const paymentsMinus = [];
  acc.movements.forEach((payment) => {
    if (payment > 0) {
      paymentsPlus.push(payment);
    } else {
      paymentsMinus.push(payment);
    }
  });
  const receipt = paymentsPlus.reduce((sum, payment) => {
    return sum + payment;
  });
  const offs = paymentsMinus.reduce((sum, payment) => {
    return sum + payment;
  });
  const sum = acc.movements.reduce((sum, payment) => {
    return sum + payment;
  });
  labelSumIn.innerHTML = `${receipt}₽`;
  labelSumOut.innerHTML = `${offs}₽`;
  labelSumInterest.innerHTML = `${sum}₽`;
}
//баланс
function changingOfBalance(acc) {
  const balance = acc.movements.reduce((storage, value) => {
    return storage + value;
  });
  acc.balance = balance;
  labelBalance.innerHTML = `${acc.balance} RUB`;
}
//логин
function createLogin(accs) {
  accs.forEach((acc) => {
    acc.logIn = acc.owner
      .toLowerCase()
      .split(" ")
      .map((val) => val[0])
      .join("");
  });

  // const userLogin = accs
  //   .toLowerCase()
  //   .split(" ")
  //   .map((val) => val[0])
  //   .join("");
  // return userLogin;
  // }
  // accounts.forEach((val) => {
  //   val.logIn = createLogin(val.owner);
  //   console.log(val);
}
createLogin(accounts);
console.log(accounts);
//платежи
function displayMovenets(acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (value, i) {
    const typeMessage = value > 0 ? "внесение" : "снятие";
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    const type = value > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">
      ${i + 1} ${typeMessage}
    </div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${value}₽</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function updateUi(acc) {
  displayMovenets(acc);
  changingOfBalance(acc);
  sumModif(acc);
}

let currentAccount;
//вход пользователя
btnLogin.addEventListener("click", (e) => {
  e.preventDefault(); //страница теперь не обновляется
  currentAccount = accounts.find((acc) => {
    return acc.logIn === inputLoginUsername.value;
  });
  console.log(currentAccount);
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = "";

    //изменение даты текущего баланса
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const day = `${now.getDate()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${now.getFullYear()}`;

    displayMovenets(currentAccount);
    changingOfBalance(currentAccount);
    sumModif(currentAccount);
  }
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const reciveAcc = accounts.find((acc) => {
    return acc.logIn === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value);
  console.log(amount, reciveAcc);
  if (
    reciveAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciveAcc.logIn !== currentAccount
  ) {
    currentAccount.movementsDates.push(new Date().toISOString());
    currentAccount.movements.push(-amount);
    reciveAcc.movements.push(amount);
    updateUi(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = "";
  }
});

// const arr = [100, 222, 333, 444];
// let usd = [];
// arr.forEach(function (value) {
//   usd.push((value / 100).toFixed(1));
// });
// console.log(usd);

// const arr2 = arr.map((value) => value / 100);
// console.log(arr2);

// const arr = [0, 7, 5, -12, -45, 5, -1, 34];

// const arr2 = arr.filter((value) => value >= 0);
// console.log(arr2);

// const sum = arr.reduce(function (acc, value, key, arr) {
//   return acc + value;
// });
// console.log(sum);

// const max = arr.reduce((acc, val) => {
//   if (acc > val) {
//     return acc;
//   } else {
//     return val;
//   }
// }, arr[0]);
// console.log(max);

// const index = accounts.findIndex((acc)=>{
//   return acc.logIn === 'df'
// })
// console.log(index);

//функция закрытия аккаунта
btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.logIn &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex((acc) => {
      return acc.logIn === currentAccount.logIn;
    });
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});
//функция внесения денег
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUi(currentAccount);
  }
  inputLoanAmount.value = "";
});

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovenets(currentAccount, !sorted);
  sorted = !sorted;
});
// const accMov = accounts.map((acc)=>{
//   return acc.movements
// })
// console.log(accMov);
// const allMov = accMov.flat()
// console.log(allMov);
// const allBalance = allMov.reduce((acc, val)=>{return acc+val}, 0)
// console.log(allBalance);

const overBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, val) => acc + val, 0);
console.log(overBalance);

// const someResult = arr.some((val)=>{
//   return val<0
// })
// const everyRes = arr.every((val)=>{return val>0})
// console.log(someResult);
// console.log(everyRes);

// const arr = [[1,[2,3]], 4, [5,6,7]]
// console.log(arr.flat(2));
// const arr = ['e', 't', 'a', 'q']
// console.log(arr.sort());

const arr = [1, 2, 3, 4, 5];
console.log(arr.fill(1, 2, 4));
const arr2 = "13445";
console.log(Array.from(arr2, (val) => "Число " + val));

const future = new Date(2025, 3, 13);
const now = new Date(2025, 2, 13);
const res = +future - +now;
console.log(Math.round(res / 1000 / 60 / 60));

console.log([] + false - null + true); //Nan
console.log(5*'хелло'); 
const a=[1,2]
const b=[1,2]
console.log(a==b);
(function() { alert(a) })()



let obj = {
  "0": 1,
  0: 2
 };
 alert( obj[0] );