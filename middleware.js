const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const {listingSchema , reviewSchema} = require("./schema");
const Review = require("./models/review");


/*----------------------------------Error Handling--Validate's on listings and reviews------------------------------- */
module.exports.validateListing =  (req, res, next ) => {
    let {error} = listingSchema.validate(req.body);
    if(error){ 
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req , res , next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
};



// isloggedIn , is checks the user is login or not for , give any operation 
module.exports.isloggedIn = (req, res , next) => {

    if(!req.isAuthenticated()){
        // redirectUrl save
        req.session.redirectUrl = req.originalUrl;// like redirect is a variable 
        req.flash("error" , "You must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
};

// use for direct re direct from , edit to edit , delete to delete 
module.exports.saveRedirectUrl = (req, res , next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// isOwner check's the -. original owner is present or not, for edit , and delete 
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

// isReviewAuthor -> jo delete kr rha h , vo review ka owner h ya nai 
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}