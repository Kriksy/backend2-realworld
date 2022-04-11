const { Router } = require("express");
var mongoose = require('mongoose');
var { Article } = require("../../models/articleSchema");
// const { User } = 

const route = Router();

route.get("/", async (req, res, then) => {
    // console.log("Tags req:");
    // console.log(req.body)
    
    var allArticles = await Article.find({}, {_id:0, tagList:1});
    // console.log("allArticles:");
    // console.log(allArticles);
    

    // Function to filter unique items in an array
        // const unique = (value, index, self) => {
        //     return self.indexOf(value) ===  index;
        // }
        // const ages = [26, 27, 26, 27];
        // const uniqueAges = ages.filter(unique);
        // console.log("uniqueAges:");
        // console.log(uniqueAges);
    

    
    let allTagsArray = [];
    for(let i = 0; i < allArticles.length; i++){

        allArticles[i].tagList?.forEach(tag => {
            // console.log(tag)
            allTagsArray.push(tag)
        })
    }
    // console.log("allTagsArray:")
    // console.log(allTagsArray);

    tags = [allTagsArray] 
    // console.log("tags:")
    // console.log(tags)
   
    res.send({tags});
 
    
})


module.exports = route