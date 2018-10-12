const express = require('express');
const keys = require('./config/keys');
const stripe =  require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphps = require('express-handlebars');

const app = express();

//handlerbars middleware
app.engine('handlebars', exphps({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set the static folder
app.use(express.static(`${__dirname}/public`));

//Index rout
app.get('/',(req, res)=>{
    res.render('index',{
        stripePublishableKey: keys.stripePublishableKey
    });
})
app.get('/abstract',(req, res)=>{
    res.render('abstract',{
        stripePublishableKey: keys.stripePublishableKey
    });
})
app.get('/neel',(req, res)=>{
    res.redirect('http://neelgajjar.com')
})
//charge rout
app.post('/charge',(req, res)=>{
    const amount = 2500;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    }).then(customer => stripe.charges.create({
        amount,
        description: 'PWA Thesis',
        currency:'usd',
        customer:customer.id
    })).then(charge => res.render('success'))
})
const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})

