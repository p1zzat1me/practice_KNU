const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://nnikitos818:Nikitos2004@cluster0.dxros6q.mongodb.net/TicketsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection to mongodb failed:'));
db.once('open', () => {
    console.log('connected to mongodb!');
});


const TicketOrder = mongoose.model('TicketOrder', {
  name: String,
  email: String,
  quantity: Number,
  event: String,
});


app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function (req, res) {

  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.post('/add', async (req, res) => {
  try {
    const { name, email, quantity, event } = req.body;

    const newOrder = new TicketOrder({
        name,
        email,
        quantity,
        event,
    });


    await newOrder.save();

    const thankYouMessage = `Бажаємо яскравої прогулянки по нашому саду, ${name}! ${quantity} квитків зарезервовано на подію ${event}.`;
    res.status(200).json({
        message: 'Order successfully saved.',
        order: newOrder.toObject(),
        thankYouMessage: thankYouMessage,
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
