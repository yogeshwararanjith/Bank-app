// Data
const account1 = {
    owner: 'Vivek Vatsav',
    transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  };
  
  const account2 = {
    owner: 'Vinay Santhosh',
    transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  };
  
  const account3 = {
    owner: 'Rohith',
    transactions: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  };
  
  const account4 = {
    owner: 'Jhon',
    transactions: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  };
  
const accounts = [account1, account2, account3, account4];


const userInput = document.querySelector('.login__input--user');
const userPin = document.querySelector('.login__input--pin');
const login = document.querySelector('.login__btn');

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currentDate = document.querySelector('.date');
const date = new Date();
let day = date.getDate();
let month = date.getMonth()+1;
let year = date.getFullYear();

const createUserNames = function(accnt){
    accnt.forEach(acc => {
       acc.userName = acc.owner.split(' ').map(w=>w[0].toLocaleLowerCase()).join('');
    })
}

createUserNames(accounts);

let currentAccount;

login.addEventListener('click',function(event){
    event.preventDefault();
    console.log(userInput.value)
    currentAccount = accounts.find(acc => acc.userName === userInput.value);
        if(Number(userPin.value) === currentAccount?.pin){
            labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
            containerApp.style.opacity = 100;
            currentDate.textContent = `${day}/${month}/${year}`;
            startCountdown(5*60);
        }
        userInput.value = userPin.value = '';
        userPin.blur();
        updateUI(currentAccount);
});

const inr = new Intl.NumberFormat("en-IN",{style: 'currency', currency: 'INR'});

// caculating balance
const calcBalance = function(acc){
    acc.balance = acc.transactions.reduce((acc,it)=>acc+it,0)
    labelBalance.textContent = `${inr.format(acc.balance)}`;
}

// displaying transactions in accounts
const displayTransactions = function(transactions,sort=false){
    containerTransactions.innerHTML = '';
    const trans = sort?transactions.sort((a,b)=>a-b):transactions;
    trans.forEach((it,idx) => {
       const type =  it>0?'deposit':'withdrawal';
        const html = `<div class="transactions__row">
        <div class="transactions__type transactions__type--${type}">${idx+1} ${type}</div>
        <div class="transactions__value">${it}</div>
      </div>`
      containerTransactions.insertAdjacentHTML('afterbegin',html);
    });    
}

const calcDisplaySummary = function(acc){
    const sumIn = acc.transactions.reduce((acc,it)=>it>0?acc+it:acc+0,0);
    labelSumIn.textContent = `${inr.format(sumIn)}`;

    const sumOut = acc.transactions.reduce((acc,it)=>it<0?acc+it:acc+0,0);
    labelSumOut.textContent = `${inr.format(sumOut)}`;

    const intrst = acc.transactions?.filter(mov => mov < 0).map(deposite => deposite * acc.interestRate/100).reduce((acc,it)=>acc-it,0);
    labelSumInterest.textContent = `${inr.format(intrst)}`;
}

const updateUI = function(acc){
    if(acc){
        displayTransactions(acc.transactions);
        calcBalance(acc);
        calcDisplaySummary(acc);
    }else{
        alert("Account with this credentials does not exist")
    }
}

let sorted = false;
btnSort.addEventListener('click',function(e){
    e.preventDefault();
    console.log(sorted)
    displayTransactions(currentAccount.transactions,!sorted);
    sorted = !sorted;
    console.log('inside'+sorted)
});
console.log('outside'+sorted)


// transfer money
btnTransfer.addEventListener('click',function(e){
    e.preventDefault();
    const transferAcct = accounts.find(acc=>acc.userName === inputTransferTo.value);
    const transferAmt = Number(inputTransferAmount.value);
    inputTransferAmount.value = inputTransferTo.value = '';
    if(transferAmt>0 && currentAccount.balance >= transferAmt && transferAcct.userName !== currentAccount.userName){
        transferAcct.transactions.push(transferAmt);
        currentAccount.transactions.push(-transferAmt);
    }
    // by updating ui with current accnt we are managing state
    updateUI(currentAccount);
});

// loan
btnLoan.addEventListener('click',function(e){
    e.preventDefault();
    const loanAmt = Number(inputLoanAmount.value);
    inputLoanAmount.value = '';
    if(loanAmt > 0 && currentAccount.transactions.some(mov => mov >= loanAmt * 0.1)){
        currentAccount.transactions.push(loanAmt);
    }
    updateUI(currentAccount);
});

//close acct
btnClose.addEventListener('click',function(e){
    e.preventDefault();
    if(currentAccount.userName === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)){
        const idx = accounts.findIndex(acc => acc.userName === currentAccount.userName);
        accounts.splice(idx,1);
        containerApp.style.opacity = 0;
    }
    labelWelcome.textContent = 'Log in to get started';
    inputCloseUsername.value = inputClosePin.value = '';
});


// timer function
const timer = document.querySelector('.timer');

const startCountdown = function(duration){
    let timeRemaining = duration;

    let countdown = setInterval(function(){
        let minutes = Math.floor(timeRemaining/60);
        let seconds = timeRemaining%60;
        seconds = seconds < 10 ? "0"+seconds:seconds;
        timer.textContent = `0${minutes}:${seconds}`;
        if(timeRemaining <= 0){
            clearInterval(countdown);
            containerApp.style.opacity = 0;
            labelWelcome.textContent = 'Log in to get started';
        }else{
            timeRemaining--;
        }
    },1000)
}


