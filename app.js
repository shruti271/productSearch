// Require necessary modules
var express = require('express');
var path = require('path');
const routes = require('./route');
// Create an Express application
var app = express();

// Require Express Handlebars for template engine
const exphbs = require('express-handlebars');

// Define the port for the server to listen on
const port = process.env.port || 3000;

// Configure Express Handlebars as the view engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs',
helpers:{
    formatPrice: function(price) {
        return '$' + price.toFixed(2); // Assuming price is a number
    },
    gtReview:function(review){
        return review>0?true:false;        
    },
    showRow:function(data){
        return `<tr class="${data.reviews>0?"":"highlightspan"}">
        <td> <span >${data.title}</span ></td>
        <td> <span >  <img src='${data.imgUrl}'style="width: 30px; height: 30px;"/> </span >  </td>
    <td > <span > ${data.stars} </span>  </td>
    <td><span >  ${data.reviews==0?"N/A":data.reviews} </span>  </td>
    <td><span >  ${data.prie?data.prie:""} </span>  </td>
    <td><span >  ${data.listprice?data.listprice:""}  </span> </td>
    <td><span >  ${data.categoryName} </span>  </td>
    <td> <span > ${data.isbestseller?data.isbestseller:""}</span>   </td>
    <td><span >  ${data.boughtInLastMontd?data.boughtInLastMontd:""} </span> </td><tr>`;
    }
    // showRow:function(data){
    //     return `<tr style="${data.reviews>0?"":"background-color:yellow"}">
    //     <td>${data.title}</td>
    //     <td>   <img src='${data.imgUrl}'style="width: 30px; height: 30px;"/>   </td>
    // <td>  <mark>${data.stars}</mark>  </td>
    // <td>  ${data.reviews==0?"N/A":data.reviews}  </td>
    // <td>  ${data.prie?data.prie:""}  </td>
    // <td>  ${data.listprice?data.listprice:""}  </td>
    // <td>  ${data.categoryName}  </td>
    // <td>  ${data.isbestseller?data.isbestseller:""}  </td>
    // <td>  ${data.boughtInLastMontd?data.boughtInLastMontd:""}  </td><tr>`;
    // }
    
    } }));
app.set('view engine', 'hbs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes)//it will direct to the route.js file

// Define route for the homepage
app.get('/', function(req, res) {
  // Render the 'index' template and pass a title parameter
  res.render('index', { title: 'Express' });
});

// Define route for '/users'
app.get('/users', function(req, res) {
  // Respond with a simple message
  res.send('respond with a resource');
});

// Catch-all route for any other routes that weren't matched
app.get('*', function(req, res) {
  // Render the 'error' template with an error message
  res.render('error', { title: 'Error', message:'Wrong Route' });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
