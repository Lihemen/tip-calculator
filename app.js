const tipPercents = document.querySelectorAll('input[name="tipPercentage"]');
const billInput = document.querySelector('input[name="bill"]');
const noPeople = document.querySelector('input[name="noPeople"]');
const buttonGrid = document.querySelector('.button_grid');
const checkoutBtn = document.querySelector('#checkoutBtn');
const resetBtn = document.querySelector('#resetBtn');
const tipPerPersonScreen = document.querySelector('.tipamount');
const billPerPersonScreen = document.querySelector('.billamount');

var data = {
  bill: 0,
  tip: 0,
  people: 0,
};

billInput.addEventListener('change', function () {
  data = { ...data, bill: parseFloat(this.value !== '' ? this.value : 0) };
});
noPeople.addEventListener('change', function () {
  data = { ...data, people: parseInt(this.value !== '' ? this.value : 0) };
});

class PaymentSystem {
  constructor(bill, tip, customers) {
    this.bill = bill;
    this.tip = 0;
    this.tipPercent = tip;
    this.customers = customers;
    this.total = 0;
  }

  calculateTip(num) {
    this.tipPercent = num ?? this.tipPercent;

    this.tip = (this.bill * this.tipPercent) / 100;

    return this;
  }

  checkout() {
    const tip = this.calculateTip(this.tipPercent).tip;
    this.total = this.bill + tip;

    return this;
  }

  splitTip(numOfPeople) {
    const toDivide = this.customers || numOfPeople;
    this.tipSlpit = this.calculateTip().tip / toDivide;
    if (isNaN(this.tipSlpit)) {
      this.tipSlpit = this.tip;
    }
    return this;
  }

  splitTotal(numOfPeople) {
    const toDivide = this.customers || numOfPeople;
    this.billSplit = this.checkout().total / toDivide;
    if (isNaN(this.billSplit)) {
      this.billSplit = this.bill;
    }
    return this;
  }
}

tipPercents.forEach((btn) => {
  btn.addEventListener('click', function () {
    toggleTip(this.value);
    btn.classList.toggle('selected');
    removeSiblingWithMatchingSelector(btn, 'selected');
  });
});

function removeSiblingWithMatchingSelector(target, selector) {
  const parent = target.parentNode;
  const children = parent.children;

  [...children].forEach((child) => {
    if (child.classList.contains(selector) && child.value != target.value) {
      child.classList.remove(selector);
    }
  });
}

function toggleTip(val) {
  switch (val) {
    case '5%':
      data = { ...data, tip: 5 };
      break;
    case '10%':
      data = { ...data, tip: 10 };
      break;
    case '15%':
      data = { ...data, tip: 15 };
      break;
    case '25%':
      data = { ...data, tip: 25 };
      break;
    case '50%':
      data = { ...data, tip: 50 };
      break;
    case 'Custom':
      showModal();
      break;
    default:
      data = { ...data, tip: 5 };
      break;
  }
}

function hideModal() {
  const el = document.querySelector('.modal_overlay');
  if (el) el.parentElement.removeChild(el);
}

function addClass(el) {
  const parent = el.parentNode;
  const children = parent.children;

  console.log(children);
}

function showModal() {
  hideModal();
  const markup = `
    <div class="modal_overlay">
    <button class="modal_close">x close</button>
      <div class="modal">
        <h5>Enter custom tip% </h5>
        <div class="input_container">
          <span class="input__icon" >$</span>
          <input
            type="text"
            placeholder="0"
            name="tip"
            class="input"
            value="0"
          />
        </div>
        <button id="submitCustomTip" class="btn btn--lighter" >Submit</button>
      </div>
    </div>
  `;

  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  document.querySelector('.modal_close').addEventListener('click', hideModal);
  document.querySelector('#submitCustomTip').addEventListener('click', () => {
    const value = document.querySelector('input[name="tip"]').value;
    data.tip = parseFloat(value);
    hideModal();
  });
  return;
}

function displayToTipScreen(val) {
  const value = val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  return (tipPerPersonScreen.innerHTML = `$${value}`);
}

function displayToTotalScreen(val) {
  const value = val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  return (billPerPersonScreen.innerHTML = `$${value}`);
}

function reset() {
  data = {
    bill: 0,
    tip: 0,
    people: 0,
  };
  billInput.value = 0;
  noPeople.value = 0;
  displayToTipScreen('0.00');
  displayToTotalScreen('0.00');
}

function checkout() {
  const payBill = new PaymentSystem(data.bill, data.tip, data.people);
  let result = payBill.calculateTip().checkout().splitTip().splitTotal();

  displayToTipScreen(result.tipSlpit);
  displayToTotalScreen(result.billSplit);
}

checkoutBtn.addEventListener('click', checkout);
resetBtn.addEventListener('click', reset);
