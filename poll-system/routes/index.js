var express = require('express');
var router = express.Router();

const Tracker = require('../tracker.model.js');
module.exports = function(io) {
//console.log(io)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/results', function(req, res, next) {
  res.render('tracker', { title: 'Express' });
});



router.get('/get-poll-data', function(req, res, next) {
  var json = {
    "topic": "What color you like most ?",
    "choices": [
      {
        "value": "Red",
        "votes": 2,
        "id": 0
      },
      {
        "value": "Blue",
        "votes": 7,
        "id": 1
      },
      {
        "value": "Green",
        "votes": 17,
        "id": 2
      }
    ]
  }
  res.send({data: json})
});


router.get('/poll-data', function(req, res, next){
  Tracker.find().then(data=>{
    res.send(data)
  }).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes."
    });
  });
});

router.post('/update-data', function(req, res, next) {

  if(!req.body.data) {
    return res.status(400).send({
        message: "content can not be empty"
    });
``}


 Tracker.findOneAndUpdate({recordId: 2}, req.body,{upsert:true, new:true}).then(data => {
  
   if(!data) {
      return res.status(404).send({
          message: "Data not found with id " + req.query.id
        });
   }
  io.emit("xo", true)
   
   console.log("New Poll data received")
   res.send(data);
 }).catch(err => {

      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Data not found with id " + req.query.id
          });                
      }
      return res.status(500).send({
          message: "Error updating record with id " + req.query.id
      });
    });
});

router.get('/save-data', function(req, res, next){

  const note = new Tracker({
    title: "demo poll 1", 
    recordId: 2,
    data : [
      {color:"red", value:9},{color:"blue", value:9},{color:"green", value:9}
    ]
  });

  note.save()
  .then(data => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the Note."
      });
  });

});
return router;
}
//module.exports = router;
