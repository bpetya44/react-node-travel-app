const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoute = require('./routes/users')
const pinRoute = require('./routes/pins')

dotenv.config();

app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
             })
    .then(() => {
        console.log('MongoDb Connected');
        })
    .catch(err => console.log(err));
        

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);



app.listen(8000, () => {
    console.log("Server is running on port 8000");
});