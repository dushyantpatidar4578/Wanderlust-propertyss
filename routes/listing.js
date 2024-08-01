const express = require("express");
const router = express.Router();
const wrapAsyc = require("../utils/wrapAsyc");
const Listing = require("../models/listing");
const { isloggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listings");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({ storage});



// All Listing , create new 
router
    .route("/")
    .get(wrapAsyc(listingController.index))
    .post(isloggedIn, upload.single("image"), wrapAsyc(listingController.createListing));
    
    /*.post(upload.single("image") , (req, res) => {
        res.send(req.file);
        console.log(req.file);
    });*/


// new Route , For create 
router.get("/new", isloggedIn, listingController.renderNewForm);


// Show , Update , Delete 
router
    .route("/:id")
    .get(wrapAsyc(listingController.showListing))// show Route
    .put(isloggedIn, isOwner,upload.single("image"), wrapAsyc(listingController.updateListing)) // Update Route 
    .delete(isloggedIn, isOwner, wrapAsyc(listingController.destoryListing)); // Delete Route 

//Edit Route    
router.get("/:id/edit", isloggedIn, isOwner, wrapAsyc(listingController.renderEditForm));



/*----------------------------------------Listings Routes------------------------- */
/*


// Index Route to show all propert's
router.get("/", wrapAsyc(listingController.index));


// Create New Route ->
router.get("/new", isloggedIn, listingController.renderNewForm);


//Show Route ->
router.get("/:id", wrapAsyc(listingController.showListing));


//Create New Route , Get data from new.ejs
router.post("/", isloggedIn, wrapAsyc(

    // cheack if not right data then handle error
    //if(!(title, description, image, price, location, country)){
    //   throw new ExpressError(400 , "Send Valid data for listingssss");
    //};

    //let result = listingSchema.validate(req.body);
    //if(result.error){
    //    throw new ExpressError(400 , result.error);
    //};

    listingController.createListing
));


// Edit Route -> 
router.get("/:id/edit", isloggedIn, isOwner, wrapAsyc(listingController.renderEditForm));


// Update Route -> 
router.put("/:id", isloggedIn, isOwner, wrapAsyc(listingController.updateListing));


// Delete Route -> 
router.delete("/:id", isloggedIn, isOwner, wrapAsyc(listingController.destoryListing));
*/

module.exports = router;



