document.getElementById('reservation-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const stripe = Stripe('pk_test_51OpGXoBSHXNDJBCJMhyCcHXaJW60BXuuUyAxbuvnA1M7SXuoaNpvmwJCkYPXXqrAhKj2Rfs7G0CZDXagM7G0gGbd00pDvuUFd4');

    const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            checkin: document.getElementById('checkin').value,
            checkout: document.getElementById('checkout').value,
            roomType: document.getElementById('room-type').value
        })
    });

    const { clientSecret } = await response.json();

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.create('card'),
            billing_details: {
                name: document.getElementById('name').value,
            },
        }
    });

    if (error) {
        console.error(error);
    } else {
        console.log('Payment successful!');
        // Redirect to a confirmation page or show a success message
    }
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51OpGXoBSHXNDJBCJpZtYJsUSzkGbzkbzeW9KnL1QBitIxv88KMKJwvefU8Uc7F0eWtUqyMqIYxN9h9JG3NFT90nr003COdR8fE');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/create-payment-intent', async (req, res) => {
    const { name, email, checkin, checkout, roomType } = req.body;
    
    // Calculate amount based on room type and dates
    let amount = 10000; // Default amount in cents

    // Adjust amount based on room type
    switch (roomType) {
        case 'single':
            amount = 10000;
            break;
        case 'double':
            amount = 15000;
            break;
        case 'suite':
            amount = 20000;
            break;
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        receipt_email: email,
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
