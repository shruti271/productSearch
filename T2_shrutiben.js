// Require necessary modules
const express = require('express');
const fs = require('fs');
const { body, check, validationResult } = require('express-validator');

const app = express();

app.use(express.static("public"));
const exphbs = require('express-handlebars');

app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  helpers: {
    calTofeb: function (data) {
      const celsius = parseFloat(req.body.cel);
      const fahrenheit = (celsius * 9 / 5) + 32;
      return fahrenheit;
    },
    showRow: function (data) {
      return `<tr class="${data.program > 0 ? "" : "highlightspan"}">
        <td> <span >${data.name}</span ></td>
       
    <td > <span > ${data.program} </span>  </td>
    <td > <span > ${data.studId} </span>  </td>
  
    <td><span >  ${data.gpa}  </span> </td><tr>`;
    },
    HighlightRow: function (data) {
      var da = data.program;
      console.log(da.length == 0);
      return `<tr style="${da.length === 0 ? 'background-color:yellow' : ''}">
                <td> <span >${data.name}</span ></td>     
                <td > <span > ${data.program} </span>  </td>
                <td > <span > ${data.studId} </span>  </td>
                <td><span >  ${data.gpa}  </span> </td>
              <tr>`;
    }

  }
})
);
app.set('view engine', 'hbs');

//use for parsing json
app.use(express.json());
// app.use(express.urlencoded());
app.use('/info', function (req, res, next) {

  console.log('Accessing the info ...')

  next()

})


let jsonData = JSON.parse(fs.readFileSync('public/data.json'));
app.get('/allData', (req, res) => {
  res.render('alldataexam', { products: jsonData });
});



app.get('/circleform', (req, res) => {
  // console.log(__dirname + '/circleform.html');
  res.sendFile(__dirname + '/public/circleform.html');
});

app.get('/search',
  body('radius').isEmpty(),
  (req, res) => {
    var r = -req.query.radius;

    const errors = validationResult(req);//return object wiht error and related data

    if (!errors.isEmpty()) {//if there is error it will allow to go inside

      return res.status(400).send({ errors: errors.array() });//return error message

    }
    if (r > 50 && r < 1500)
      res.send('answer id' + r);
    else
      res.send('not in range');
  })



app.get('/info', (req, res) => {
  res.send('Hello from B!')
})



app.post('/cal', (req, res) => {

  res.sendFile(__dirname + '/public/celc.html');
});


app.get('/celsearch', (req, res) => {


  res.render('data1', {
    data: res,
    layout: 'main.hbs'
  })
})
//post request
app.post(

  '/userlog',//api end point

  body('email').isEmail(),//check is it email

  body('login').isLength({ min: 10 }),//check login is min for 10 length

  (req, res) => {

    const errors = validationResult(req);//return object wiht error and related data

    if (!errors.isEmpty()) {//if there is error it will allow to go inside

      return res.status(400).send({ errors: errors.array() });//return error message

    }

    res.send(req.body)//return sucessful message

  })


// listen to this port
app.listen(3000);