'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////////////////////////////////////////////////
// LECTURE 5: CREATING DOM ELEMENTS - Moving away from just the console
const displayMovements = function (movements) {
  containerMovements.innerHTML = ''; // This is to get rid of the first two values that were there from the start. innerHTMl is a little bit similar to text content. The difference is that text content simply returns the text itself while HTML returns everything, including the HTML.
  // Good practice to pass the data into a function instead of having the function work with a global variable. It'd still work but it's a lot better to pass that data directly into a function.
  movements.forEach(function (mov, i) {
    // We'll have to create a ternary operator because we have a type-withdrawl and a type-deposit
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Here we have a callback function with the current movement and the current index.
    const html =
      // Here we'll replace the hard coded data with our actual movements data.
      ` 
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
        // We can also basically construct a class name as we change the movements_type--deposit.
        i + 1
      } ${type}</div> 
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html); // This method Adds the html we just did to the webpage. It excepts two strings. The first string is the position in which we want to attach the HTML. The second is the string containing the HTML that we want to insert.   We set containerMovements up above to be document.querySelector('movements')
  });
};

// displayMovements(account1.movements); // We're moving this as we don't want to call these functions right in the beginning when our script is loaded. We only want to calculate and display the balance and the movements and the summary,
// And as soon as we actually get the data that we want to display.

//////////////////////////////////////////////////////////
// LECTURE 9 CONTINUED - REDUCE METHOD - We put this above lecture 8 because it makes more sense to be here by the display works.
const calcDisplayBalance = function (movements) {
  const balance = movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${balance} €`;
};
// calcDisplayBalance(account1.movements);

/////////////////////////////////////////////////////////]
// LECTURE 11 CONTINUED
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0) // This wil filter and only return those array elements that are greter than 0.
    .reduce((acc, mov) => acc + mov, 0); //We take the accumulater value which we set to 0 and continue to add the current iteration of the array to it.
  labelSumIn.textContent = `${incomes}€`; // Now we set the text content on the html to that value we got.

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`; // Math.abs is to remove the negative sign.

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    }) // We want to disclude the interests that are below 1.
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${incomes}€`;
};
// calcDisplaySummary(account1.movements);

//////////////////////////////////////////////////
// LECTURE 8 - COMPUTING USERNAMES
// const createUsernames = function (user) {
//   const username = user
//     .toLowerCase()
//     .split(' ')
//     .map(function (name) {
//       return name[0]; // This gives us an array with just the first letter of Steven(s) Thomas(t) Williams(w).
//     })
//     .join(''); // This gives us stw.
//   return username;
// };
// Modifying this so we can receive all the accounts.
const createUsernames = function (acc) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner // We take the account.owner and create our username from that and we create a new property on that element.
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0]; // This gives us an array with just the first letter of Steven(s) Thomas(t) Williams(w).
      })
      .join(''); // This gives us stw
  });
};

createUsernames(accounts); // ['steven', 'thomas', 'williams']
console.log(accounts);

// EVENT HANDLERS
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // This will prevent form from submitting.
  console.log('LOGIN');

  // Log in the user using the find method
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  // Check pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Here we use optional chaining so the pin will only be read if the currentAccount exists.
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`; // We'll take only the first word by using split and then from resulting array we simply take the first element.
    containerApp.style.opacity = 100; // This will have everything fade in as we set the opacity to 0 in css.

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = ' '; // This works because the assignment operator works from right to left.
    inputLoginPin.blur();
    // Display movements
    displayMovements(currentAccount.movements);
    // Display balance
    calcDisplayBalance(currentAccount.movements);
    // Display summary
    calcDisplaySummary(currentAccount);
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//LECTURE 1: SIMPLY ARRAY METHODS
// Arrays have methods because methods are simply functions that we can call on objects which means that arrays are also objects.
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
// With slice we can take slice of an array. Does not mutate array, instead it returns a new array which is the copy but with the extracted parts.
console.log(arr.slice(2)); // We get an array with [c, d, e]
console.log(arr.slice(2, 4)); // [c, d] // Just like with strings the end parameter is not included.
console.log(arr.slice(-2)); // This will copy from the end of the array so we get ['d', 'e'];
console.log(arr.slice(1, -2)); // ['b', 'c'] So it'll extract starting from 1 everything except the last 2.
// Can use slice to create a shallow copy of any array.
console.log(arr.slice()); // Here we get the exact same array.
console.log([...arr]); // This gives us the exact same result which is using spread on the array inside of an empty array. Up to you which to use.
// Best time to use slice method is when you want to chain multiple methods together, so calling one after the other.

// SPLICE - Works almost in same way as slice but fundamental difference it does actually change the original array.
//console.log(arr.splice(2)); // Same as the one with slice. [c, d, e]
//console.log(arr); // all that remains in original array is now the first 2 elements. [a, b].
// One pretty common usecase of splice is to delete the last element of an array.
arr.splice(-1); // It is the original array except for the last element.
arr.splice(1, 2); //The second parameter is called delete count. With this b and c are deleted. The first parameter works the same as splice but the second is really the number of elements that we want to delete.
console.log(arr);

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse()); // This gives us the reveresed array. This mutates the orignal array.

// CONCAT - Doesn't mutate
const letters = arr.concat(arr2);
console.log(letters); // With this we have the 10 first letters of the alphabet.
console.log(...arr, ...arr2); // We could also do this for the same result and does not mutate any of the involved arrays.

// JOIN
console.log(letters.join(' - ')); // Here we get our string with the seperator that we specified. So a - b - c.... So on and so forth without an array.
*/
////////////////////////////////////////////////////////////////////////
// LECTURE 2: LOOPING ARRAYS: FOREACH
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// Let's say we wanted to loop over this array in order to print a message for each movement in this bank account. So the positive values are deposits and the negative values are withdrawals.

for (const [i, movement] of movements.entries()) {
  // The i will be the the current index and we need entries in order to access it. It starts at 0 so we do + 1.
  if (movement > 0) {
    console.log(`Movement ${i + 1} You deposited ${movement}.`);
  } else {
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`); // Math.abs removes the sign.
  }
}
// console.log('FOREACH');
// movements.forEach(function (movement) {
//   // When exactly will forEach call this function? What this method does is loop over the array, and in each iteration it will execute the calback function. Also as it calls the callback function in each iteration it will pass in the current element of the array as an argument, so we can specify that and we do as movement.
//   if (movement > 0) {
//     console.log(`You deposited ${movement}.`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }); // The forEach requires a callback function. forEach is technically a higher order function which requires a callback function in order to tell it what to do. The forEach method will call this function, we're not calling it ourselves.
// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...
// The forEach passes in the current element, the index and the entire array that we are looping. We can thus specify them in our parameters list.

console.log('FOREACH');
movements.forEach(function (
  movement,
  i,
  array /*The order matters. THe first parameter must be the current element, the second parameter must be the current index, and third one the entire array  */

/*
) {
  // When exactly will forEach call this function? What this method does is loop over the array, and in each iteration it will execute the calback function. Also as it calls the callback function in each iteration it will pass in the current element of the array as an argument, so we can specify that and we do as movement.
  if (movement > 0) {
    console.log(`Movement ${i + 1} You deposited ${movement}.`);
  } else {
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`);
  }
});
*/

// One difference between forEach and forOf is that the break and continue do not work on forEach.
//////////////////////////////////////////////////////
// LECTURE 3: FOREACH ON MAPS AND SETS
// MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
currencies.forEach(function (
  value,
  key,
  map /*First is the current value, second is the key, and third is the entire map that is being looped over.   */
) {
  console.log(`${key}: ${value}`);
});

// SET
const currenciesUnique = new Set(['USD', 'GBP', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`); // The key here is exactly the same as the value. A set doesn't have keys and it doesn't have indexes either.
});

// Coding Challenge 1 - Did this by myself
const julia = [3, 5, 2, 12, 7];
const kate = [4, 1, 15, 8, 3];

const checkDogs = function (dogsJulia, dogsKate) {
  const notDogs = julia.splice(3);
  console.log(notDogs);
  console.log(julia);
  const correctData = [...dogsJulia, ...dogsKate];
  console.log(correctData);
  correctData.forEach(function (currDogs, i) {
    if (currDogs >= 3) {
      console.log(`Dog number ${i} is an adult, and is ${currDogs} years old!`);
    } else {
      console.log(`Dog number ${i} is still a puppy🐶`);
    }
  });
};
checkDogs(julia, kate);
/////////////////////////////////////////////////////////////
// LECTURE 6 - DATA TRANSFORMATIONS: MAPS, FILTER, REDUCE - METHODS FOR ARRAYS
// Map is similar to forEach but with difference that map creates a brand new array based upon the orginal array. It takes an array, loops over that array and in each iteration it applies a callback function that we specify to the current array element.
// This is extremely useful and usually more useful than the forEach method. Map returns a new array containing the results of applying an operation on all original array elements. Original array not mutated.
// The filter filters for elements in the orginal array which satisfy a certain condition. Returns a new array containing the array elements that passed a specified test condition.
// The Reduce method is used to boil down all the elements of the original array into one single value. In other words adding all elements together.
/////////////////////////////////////////////////////////////////
// LECTURE 7 - MAP METHOD
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]; // We will convert these to usd.
const eurToUsd = 1.1;

const movementsUSD = movements.map(function (mov) {
  return mov * eurToUsd;
});
console.log(movements);
console.log(movementsUSD);

// Arrow Function
// const movementsUSD = movements.map(mov => {
//    mov * eurToUsd;
// });

// Same thing
/*
const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);
*/
/*
const movementsDescriptions = movements.map(function (mov, i, arr) {
  if (mov > 0) {
    return `Movement ${i + 1} You deposited ${mov}.`;
  } else {
    return `Movement ${i + 1} You withdrew ${Math.abs(mov)}`;
  }
});
console.log(movementsDescriptions);å
*/
//////////////////////////////////////////////////////////////////
// LECTURE 9 - FILTER METHOD
/*
const deposits = movements.filter(function (mov) {
  return mov > 0; // Only the array elements for which this is true will make it into the deposits array.
});
console.log(deposits);

// Same but with a for of loop
const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
console.log(withdrawals);
*/
/////////////////////////////////////////////////////////////////
// LECTURE 10 - REDUCE METHOD - The most powerful array method

console.log(movements);

// In the other callback functions, the first parameter is the current element of the array, 2nd is current index, and third is entire array. Here the first parameter is called the accumulator.
// It's like a snowball that keeps accumalating the values that we want to return.
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur; // In each call of callback function, the accumulator will be the current sum of all the previous values. In each iteration we return the updated accumulator plus the current new value.
}, 0); // Here we can specify the initial value of the accumulator in the first loop iteration.
console.log(balance); // Here we get one single number, 3840

// Using the for loop. Works well when you only need 1 loop but becomes cumbersome and unpractical when we use many for doing many operations.
let balance2 = 0; // This will be the initial value
for (const mov of movements) balance2 += mov;
console.log(balance2);

// Maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]); // We don't put 0 here as imagine if the first value would have been negative then this might not work as expected.
console.log(max);

// Coding Challenge 2

// LECTURE 11 - THE MAGIC OF CHAINING METHODS
// Convert euros to dollars and then add them all up
const euroToUSD = 1.1;
// movements.filter(
//   function (mov) {
//     mov > 0;
//   }
//     .map(function (mov) {
//       mov * eurToUsd;
//     })
//     .reduce((acc, mov))
// );
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUSD)
  .reduce((acc, mov) => acc + mov, 0); // We could not have chained the map or filter after this as here we get the value. We can only chain a method one after another one, if the first one returns an array.
console.log(totalDepositsUSD);

// We should not overuse chaining. We should try to optimize it because chaining tons of methods one after the other can cause real performance issues if we have really huge arrays.
// If we have a big array, we should try to compress the functionality down into as little methods as possible.
// It is also bad a method to chain methods that mutate the underlying original array. An example of that is the splice method.

// LECTURE 12 - THE FIND METHOD
// We can use find method to retrieve one element of an array based on a condition.
// Also accepts a callback function which will be called as the method loops over the array
// It will not return a new array but it will only return the first element in this array that satisfies the condition.
//const firstWithdrawal = movements.find(mov => mov < 0);
const firstWithdrawal = movements.find(function (mov) {
  return mov > 0;
});

console.log(movements);
console.log(firstWithdrawal);
// 2 fundamental differences between filter and find. First, filter returns all the elements that match the condition while the find method only returns the first one
// Second, and even more important, filter method returns new array while find only returns the element itself.

console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis'); // As we loop over accounts, each of the current elements is one account
console.log(account);

// LECTURE 13 - IMPLEMENTING LOGIN
