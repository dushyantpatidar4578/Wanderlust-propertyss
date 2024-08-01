const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
    },
    description : String,
    image: {
        //type : String,
        //default: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //set: (v) => v === "" ? "https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        
        url:String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner:{
        type : Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete" , async(listing) => {
    if(listing){
        await Review.deleteMany({ _id : {$in : listing.reviews }});
    }
});

const Listing = mongoose.model("Listings", listingSchema);
module.exports = Listing;