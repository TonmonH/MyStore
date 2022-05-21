let balance = 300;
let debt = 0;
let pay = 300;
let laptops = [];
let loans = 0;
let boughtLaptops = 0;

function init(){
    updateBalance()
    updatePay()
    fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
      .then(response => response.json())
      .then(data => insertLaptops(data));
}
init();

document.getElementById('get-a-loan').addEventListener('click', function(){
    document.getElementById('get-a-loan-popup').style.display = 'block';
});

document.getElementById('get-a-loan-popup-close').addEventListener('click', function(){
    document.getElementById('get-a-loan-popup').style.display = 'none';
});

document.getElementById('get-loan-confirm').addEventListener('click', function(){
    const input = document.getElementById('loan-amount-input').value;
    const loanAmount = parseFloat(document.getElementById('loan-amount-input').value);
    if (!isNaN(loanAmount)) {
        const maxLoanAmount = balance*2
        if (loanAmount > maxLoanAmount) {
            alert('Max loan amount is twice you balance.');
        }
        else if (loans > 0 && boughtLaptops == 0) {
            alert('Cannot get another loan until you bought a computer.');
        }
        else if (debt > 0) {
            alert('Cannot get another loan until you have payed previous loans.');
        }
        else {
            debt += loanAmount;
            loans += 1;
            updateRepayLoan();
            document.getElementById('get-a-loan-popup').style.display = 'none';
        }
    }
    else {
        alert('Invalid number inputted.');
    }
});

document.getElementById('bank-button').addEventListener('click', function(){
    if (debt > 0) {
        const minLoanRepayment = pay * 0.1;
        debt -= minLoanRepayment;
        pay -= minLoanRepayment;
        updateRepayLoan();
    }
    balance += pay;
    pay -= pay;
    updateBalance();
    updatePay();
});

document.getElementById('work-button').addEventListener('click', function(){
    pay += 100;
    updatePay();
});

document.getElementById('repay-loan-button').addEventListener('click', function(){
    debt -= pay;
    pay -= pay;
    updatePay();
    updateRepayLoan();
});

document.getElementById('buy-laptop-button').addEventListener('click', function(){
    const laptop = laptops[document.getElementById('laptops').value];
    if (laptop.price > balance) {
        alert('You cannot afford the laptop.');
    }
    else {
        boughtLaptops += 1
        balance -= laptop.price
        updateBalance();
        alert('You are now the owner of the new laptop.');
    }
});

function updateBalance() {
    document.getElementById('balance').innerText = balance + ' kr'
}

function updatePay() {
    document.getElementById('pay').innerText = pay + ' kr'
}

function updateRepayLoan() {
    if (debt > 0) {
        document.getElementById('repay-loan').style.display = '';
    }
    else {
        document.getElementById('repay-loan').style.display = 'none';
    }
}

function insertLaptops(data) {
    laptops = data;
    let options_html = '';
    data.forEach(function(item, index) {
        options_html += '<option value="' + index + '">' + item.title + '</option>';
    });
    document.getElementById('laptops').innerHTML = options_html;
    updateSelectedLaptop();
}

document.getElementById('laptops').addEventListener('change', function(){
    updateSelectedLaptop();
});

function updateSelectedLaptop() {
    const laptop = laptops[document.getElementById('laptops').value];
    document.getElementById('laptop-image').setAttribute('src', 'https://noroff-komputer-store-api.herokuapp.com/' + laptop.image);
    document.getElementById('laptop-title').innerText = laptop.title
    document.getElementById('laptop-description').innerText = laptop.description
    document.getElementById('laptop-price').innerText = laptop.price + ' kr'
    document.getElementById('laptop-specs').innerHTML = laptop.specs.join('<br>');
}