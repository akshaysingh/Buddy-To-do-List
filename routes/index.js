var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all('*', function(req, res, next) {
console.log("akshay");
});
router.post('/topicsListUsers', function(req, res, next) {
    var pageNum = 1;
    if (req.body.page) {
        pageNum = req.body.page;
    }
    console.log(pageNum);
    var perPage = 20;
    var toskip = perPage * (pageNum -1);

    var collection = db.getCollection("topics");
    var clientResult = collection.find(
    {
    },{
        "_id" : 0, "name"  : 1, "logo" : 1, "key" : 1, "num_articles" : 1, "num_followers" : 1
    }
    ).skip(toskip).limit(perPage).toArray(function(err, docs) {
        if (err) {
            res.send({
                "status" : {
                    "response" : "failure",
                    "message" : "err : " + err,
                    "userMessage" : "There is some error on server. Please try again later."
                            },
                "data" : {
                }
            });
        } else {
            console.log(docs.length);
            if (docs.length === 0) {
                res.send({
                    "status" : {
                        "response" : "failure",
                        "message" : "List Over",
                        "userMessage" : "List Over"
                    },"data" : {

                    }
                });
            } else {
                res.send({
                    "status" : {
                        "response" : "success",
                        "message" : "",
                        "userMessage" : ""
                    }
                    ,"data" : {
                        "topicsList" : docs
                    }
                });
            }
        }
    });
});

module.exports = router;
