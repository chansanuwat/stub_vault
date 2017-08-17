var express = require('express');
var router = express.Router();

// Views
router.get('/view', function(req, res) {
  res.render('stubs', { title: 'Service Mocks', category: 'All' });
});

router.get('/view/categories/:category', function(req, res) {
  res.render('stubs', { title: 'Service Mocks', category: req.params.category });
});

// API
// GET stubs listing
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('stubs');
  collection.col.aggregate([{$group: {_id: "$category", "stubs": { $push: "$$ROOT"}}}],function(e,docs){
    res.send(docs);
  });
});

// GET Categories listing
router.get('/categories', function(req, res, next) {
  var db = req.db;
  var collection = db.get('stubs');
  collection.distinct('category',function(e,docs){
    res.send(docs);
  });
});

// GET Category Stubs
router.get('/categories/:category', function(req, res, next) {
  var db = req.db;
  var collection = db.get('stubs');
  var query = {};
  (req.params.category === 'All') ? query = {} : query = {category: req.params.category};
  collection.find(query,{sort: {path: 1}},function(e,docs){
    res.send(docs);
  });
});

// Get Stub
router.get('/:id', function(req, res) {
  console.log(req.params.id);
  var db = req.db;
  var collection = db.get('stubs');
  collection.findOne({"_id": req.params.id}, function(e,result){
    res.send(result);
  });
});

// Add stub
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('stubs');
    console.log(req.body);
    collection.findOne({name: req.body.name, category: req.body.category},{}, function(err, doc){
        console.log(doc)
        if(doc != null) {
            res.send({ status: 0, msg: 'Stub already exists', data: doc });
        }
        else {
            collection.findOne({path: req.body.path, status: 1},{},function(err, existingDoc){
              (existingDoc != null) ? req.body.status = 0 : req.body.status = 1;
              req.body.response = JSON.stringify(req.body.response);
              collection.insert(req.body, function(err, result){
                  res.send(
                      (err === null) ? { status: 1, msg: 'Stub added', data: result } : { status: 0, msg: err }
                );
            });
            })
        }
    });
});

// Enable Stub
router.put('/:id/enable', function(req, res) {
    var db = req.db;
    var collection = db.get('stubs');
    collection.findOne({_id: req.params.id},{}, function(err,doc) {
      if(doc === null){
        res.send("Could not find a stub with the ID of " + req.params.id);
      }
      else {
        collection.update({_id: doc._id},{$set: {status: 1}}, function(err, result){
          if(err != null){
            res.send({ status: 0, msg: err });
          }
          else {
            collection.update({path: doc.path, _id: {$ne: doc._id}},{$set: {status: 0}}, {multi: true}, function(err, result){
              res.send(
                (err === null) ? { status: 1, msg: 'Stubs updated', data: result } : { status: 0, msg: err }
              )
            });
          }
        });
      }
    });
});

// Disable Stub
router.put('/:id/disable', function(req, res) {
    var db = req.db;
    var collection = db.get('stubs');
    collection.update({_id: req.params.id},{$set: {status: 0}}, function(err, result){
      res.send(
        (err === null) ? { status: 1, msg: 'Stubs updated', data: result } : { status: 0, msg: err }
      )
    });
});

// Delete Stub by ID
router.delete('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('stubs');
    collection.remove({_id: req.params.id}, function(err, response){
        res.send((err === null) ? { msg: 'Deleted Stub', records_deleted: response } : { msg:'error: ' + err });
    });
});

// Delete Stub
router.delete('/', function(req, res) {
    var db = req.db;
    var collection = db.get('stubs');
    collection.remove({path: req.body.path}, function(err, response){
        res.send((err === null) ? { msg: 'Deleted Stub', records_deleted: response } : { msg:'error: ' + err });
    });
});

module.exports = router;