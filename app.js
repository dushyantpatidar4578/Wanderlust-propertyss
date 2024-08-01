if( process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const { count } = require("console");
const ejsMate = require("ejs-mate");
const { nextTick } = require("process");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {isloggedIn} = require("./middleware.js");



const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public"))); // for access the public folder 


const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({ // for store session in Mongoatlas 
    mongoUrl : dbUrl, 
    crypto : {
        secret : "mysupersecretcode",
    },
    touchAfter : 24 * 3600 , // seconds , kitne time sab upadates hoga 
});

store.on("error" , () => {
    console.log("ERROR in MONGO SESSION STORE " , err);
});

const sessionOptions = {
    store , 
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized:true,
    cookie:{
        // (week-day's) + (day's-hour) + (hour-minutes) + (minutes-Seconds) + (Seconds - milisecond's)
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
        maxAge : 7 * 24 * 60 * 60 * 1000, 
        httpOnly : true,
    }
};


/*
app.get("/", (req, res) => {
    console.log("GET IS WORKING");
    res.send("GET IS Working");
});
*/



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());// for initailaize passport 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connection Successfully");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl); // it return a promise in javascript , so we use it 
};



/*
app.get("/demouser" , async (req, res) => {
    let fakeUser = new User({
        email:"student@gmail.com",
        username:"Dushyant-Patidar",
    });

    let registeredUser = await User.register(fakeUser , "HelloWorld"); // (user, password , callback)
    res.send(registeredUser);
});
*/


app.use((req, res , next) => {
    res.locals.success = req.flash("success");// succes and error both are variable's
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
}); 


/*
app.get("/testListing" , async (req , res) => {
    let sampleListing = new Listing({
        title:"My new Villa",
        description:"By the beach",
        price:1200,
        location:"Calangute , Goa",
        country:"India",
    });

    await sampleListing.save();
    console.log("Sample is Saved");
    res.send("succesful testing");
});
*/


/*-------------------------We are export the all route's using this------------- */

app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/listings" , listingsRouter);
app.use("/" , userRouter); 

/*----------------------------------------MiddleWare------------------------------- */


// if any random new route is searched and not found then 
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found! ok This is comman Error"));
});

// Middleware for handle erroe , when any string is pass in pricing -> 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs" , {message});
    //res.status(statusCode).send(message);
});
 
app.listen(8000, () => {
    console.log("Server is listing ");
});

 


