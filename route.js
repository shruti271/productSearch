/****************************************************************************** *** 
*	ITE5315 – Assignment 2
*	I declare that this assignment is my own work in accordance with Humber Academic Policy.   *  No part of this assignment has been copied manually or electronically from any other source *  (including web sites) or distributed to other students. 
*  
*	Name: _____shrutiben italiya____ Student ID: ___N01579444____________ Date: ___05-02-2024_________________ 
* 
* 
******************************************************************************
**/  
const express = require('express')
const path = require('path')
const fs = require('fs');
const exphbs = require('express-handlebars');

const router = express.Router()

// Initialize built-in middleware for urlencoding and json
router.use(express.urlencoded({extended: true}));
router.use(express.json());

let jsonData = JSON.parse(fs.readFileSync('public/datasetB.json')); 


// // step 2 
// // Chained router route for Root Route
// router.route("/")
//     .get( function (req, res) {              
//         res.sendFile(path.join(__dirname, 'public', './index.html')) 
//     })   

// step 4
//dispay data in console and store in variable
router.get('/data', (req, res) => {    
    jsonData = JSON.parse(fs.readFileSync('public/datasetB.json'));//assign data to variable
    console.log('JSON data is loaded and ready:', jsonData);    
    res.render('data',{
        data:'JSON data is loaded and ready!',
        ee
    })
})

// step 5
// display product id in browser
router.get('/data/product/:index', (req, res) => {
    const index = req.params.index;//get value from params
    
    const product = jsonData[index];//getting data from array by retrived index

    if (product) {// if we get product it will send that data back in prowser
        // res.send(product.asin);
        res.render('data',{
            data:product.asin,
            layout:'main.hbs'
        })
    } else {//else it will send error message
        // res.status(404).send('Product not found!');
        res.render('error',{
            message:'Product not found!',            
        })
    }
});

// step 6
//this url gives us html page by clicking on this we get to another page
router.get('/data/search/prdID', (req, res) => {    
    res.render('searchProdForm',{        
        layout:'main.hbs'
    })
});

//if we get this url in searchbar , it will fetch product i from url , then it will compare it with all the id of array of object
router.get('/search', (req, res) => {
    const productId = req.query.product_id;
    // Search for the product in the JSON data
    // If found, display product info
    // Otherwise, display an error
    jsonData.forEach(element => {        
        if (productId == element.asin) {//if it comes true it will send all data information            
            return res.render('data',{
                data:`<h3>${element.title}</h3> 
                <img src='${element.imgUrl}'/> 
                <table border='3'>
            <tr>
                <td><b>Starts</b></td>
                <td> ${element.stars}</td>
            </tr>
            <tr>
                <td><b>review</b></td>
                <td>${element.reviews}</td>
            </tr>
            <tr>
                <td><b>price</b></td>
                <td>${element.price}</td>
            </tr>
            <tr>
                <td><b>listPrice</b></td>
                <td>${element.listPrice}</td>
            </tr>
            <tr>
                <td><b>categoryName</b></td>
                <td>${element.categoryName}</td>
            </tr>
            <tr>
                <td><b>isBestSeller</b></td>
                <td>${element.isBestSeller}</td>
            </tr>
            <tr>
                <td><b>boughtInLastMonth</b></td>
                <td>${element.boughtInLastMonth}</td>
            </tr>
        </table>            
                `,
                layout:'main.hbs'
            })
        }
    });
    //if it don't found it will send tis message in response
    
    res.render('error',{
        message:'There is NO such data',            
    })
});

// step 7
//this url will send one html form in response
router.get('/data/search/prdName', (req, res) => {    
    res.render('data',{
        data:'<form action="/searchproductname" method="get"><input type="text" placeholder="Product Name" name="product_name"><input type="submit" value="search by product name"></form>',            
    })
});


router.get('/searchproductname', (req, res) => {
    const productName = req.query.product_name;

    let html="<table border='3'><tr><th>starts</th><th>price</th><th>category name</th><th>title</th></tr>";

    jsonData.forEach(element => {//it will pass through every element of object
        const currenttile=element.title;

        if (currenttile.includes(productName)) {            //and comapre title with word we get in url
            html+=`<tr>                
                <td> ${element.stars}</td>
                <td>${element.price}</td>            
                <td>${element.categoryName}</td>
                <td> ${currenttile.replace(productName,"<mark style='background-color:yellow'>"+productName+"</mark") }</td>
            </tr>`;
        }
    });
    html+=`</table>`;

    //if it found valid data, then it is obvioud that it should have at least one td tag  so if there is <td>' tag it will return html data
    if(html.includes("td"))
      {
        res.render('data',{
            data:html
        })
      }      
    else// if there no 'td' value in url means there is no data it will print error message
    {
        res.render('error',{
            message:'There is no such data for product Name',            
        })
    }
});

router.get('/allData', (req, res) => {
    res.render('allData', { products:jsonData });
});
// Export router
module.exports = router