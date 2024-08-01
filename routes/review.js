const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsyc = require("../utils/wrapAsyc");
const Review = require("../models/review.js");
const Listing = require("../models/listing"); 
const {validateReview, isloggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

 
/*--------------------------------------Review's--------------------------- */

// Delete Review Route 
router.delete("/:reviewId" , isloggedIn , isReviewAuthor , wrapAsyc(reviewController.destroyReview));


// Review Route :- Post review route 
router.post("/"  ,isloggedIn, wrapAsyc(reviewController.createReview));

module.exports = router;


