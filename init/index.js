const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main()
    .then(() =>{
        console.log("Connection Successfully, Data is Saved");
    })
    .catch((err) => console.log(err));

    async function main(){
        await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust'); // it return a promise in javascript , so we use it 
    };

const initDB = async () => {
    await Listing.deleteMany({});
    // yeah sab litings k andar , owner object ko initilizaed kr dega 
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner : '66a0f6c7d37c3baaa435fd6c',
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was Initialized");
}; 

initDB();