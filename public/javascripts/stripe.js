var stripe = Stripe('pk_test_i0mAS5A7uVZDTpDWkbNkAIt7');;
var elements = stripe.elements();

//add an instance of the card Element

var form = document.getElementById('payment-form');

var card = elements.create('card', {
    hidePostalCode: true
    });
//add an instance of the card Element to the card-element div
card.mount('#card-element');

//elements validating input as it is typed. If there was an error, display the error in the card-errors div.

card.addEventListener('change', function(event){
    var displayError = document.getElementById('card-errors');
    if (event.error){displayError.textContent = event.error.message}
    else{ displayError.textContent = ''}
})

//Create token


form.addEventListener('submit', function(event){
    event.preventDefault();
    var extraDetails = {
    name: form.querySelector('input[name=cardholder-name]').value,
    email: form.querySelector('input[name=email]').value,
    amount: form.querySelector('input[name=amount]').value
  };
  console.log(extraDetails);
    stripe.createToken(card, extraDetails) //returns a promise that resolves with result object.
    .then(function(result){
        if (result.error){
            //let user know there was an error
            var error = document.getElementById('card-errors');
            console.log(result.error);
            error.textContent = result.error.message;
            
        }
        else{
            //send token to server
            console.log(result);
            stripeTokenHandler(result.token);
        }
    })
});

//submit token data to the server
function stripeTokenHandler(token){
    var hidden = document.createElement('input');
    hidden.setAttribute('type', 'hidden');
    hidden.setAttribute('name', 'stripeToken');
    hidden.setAttribute('value', token.id);
    form.appendChild(hidden);
    form.submit();
}