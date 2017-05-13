const express= require('express');
var app = express();
const path = require('path');
const hbs = require('hbs')
const {config} = require('./config');
const bodyParser = require('body-parser');
const stripe = require('stripe')(config.secret_key);

var port = process.env.PORT || 3000;

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res)=>{
    res.render(path.join(__dirname, './views/index.1.hbs'));
})

app.post('/getCardToken', (req,res)=>{
    var response = req.body;
    stripe.customers.create({
        email: response.email,
        source: response.stripeToken 
    })
    .then((customer)=>{
        stripe.charges.create({
            amount:response.amount*100,
            currency: 'cad',
            customer: customer.id,
            description: 'Therapy charge'

        })
    })
    .catch((error)=>{
        console.log(`There was an error: ${error}`);
    })
     res.render(path.join(__dirname, './views/success.hbs'));
})

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}.`);
})