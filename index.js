const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
app.use(cors())
const config = require('./config/keys');
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, { useNewUrlParser: true });
require('./models/Registration');
app.use(bodyParser.json());

require('./routes/dialogFlowRoutes')(app);


const PORT = process.env.PORT || 5000;
app.listen(PORT);