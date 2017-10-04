var express = require('express');
var router = express.Router();
var randtoken = require('rand-token');
var multer = require('multer');
var rest = require('restler');
var randtoken = require('rand-token');
var MetaInspector = require('node-metainspector');
var extractor = require('article-extractor');
var db = require('../../../db/db');

router.all('*', function(req, res, next) {
	console.log("starting query");
	next();
});

router.post('/addNewUser', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var collection = db.getCollection("users");
    collection.update({
            "email" : email
        },{
            $set: {
                    "email" :  email,
                    "password" : password
            }
        },{
            upsert: true
        }, function (err) {
            if (err) {
                return res.send({
                "status" : {
                    "response" : "failure",
                    "message" : "err : " + err,
                    "userMessage" : "There is some error. Please try again later"
                },"data" : {
                }
            }); 
            } else {
            return res.send({
                "status" : {
                    "response" : "success",
                    "message" : "",
                    "userMessage" : "New user successfully added"
                },"data" : {
                }
            });
            }
        }); 
})
router.post('/login', function(req, res, next) {
    var admin_pass_string = "73069878bb6d14660a5988cfc9a6521d"
	var email = req.body.email;
    var password = req.body.password;
    if (email === "admin" && password === admin_pass_string) {
        return res.send({
            "status" : {
                "response" : "success",
                "message" : "",
                "userMessage" : ""
            },"data" : {
                "adminMode" : true
            }
        });
    }
    var collection = db.getCollection("users");
    collection.find({
        "email" : email,
        "password" : password
    },{
        "email" : 1, "password" : 1
    }).toArray(function(err, docs) {
        if (err) {
            return res.send({
                "status" : {
                    "response" : "failure",
                    "message" : "err : " + err,
                    "userMessage" : "There is some error. Please try again later"
                },"data" : {
                }
            }); 
        }
        if (docs.length === 0) {
            return res.send({
                "status" : {
                    "response" : "failure",
                    "message" : "",
                    "userMessage" : "Email password combination does not exist. Please try again"
                },"data" : {
                }
            });
        }
        return res.send({
            "status" : {
                "response" : "success",
                "message" : "",
                "userMessage" : ""
            },"data" : {
            }
        });
    });
});

router.post('/getMyList', function(req, res, next) {
    var email = req.body.email;
    var collection = db.getCollection("lists");
    collection.find({
        "createdFor" : email
    },{

    }).toArray(function(err, docs) {
        if (err) {
            return res.send({
                "status" : {
                    "response" : "failure",
                    "message" : "err : " + err,
                    "userMessage" : "There is some error. Please try again later"
                },"data" : {
                }
            }); 
        }
        return res.send({
            "status" : {
                "response" : "success",
                "message" : "",
                "userMessage" : ""
            },"data" : docs
        });
    })
});

router.post('/addNewList', function(req, res, next) {
    var createdFor = req.body.createdFor;
    var createdBy = req.body.createdBy;
    var name = req.body.name;
    var collection = db.getCollection("lists");
    var userCollections = db.getCollection("users");
    userCollections.find({
        "email" : createdFor
    }, {
        "email" : 1, "password" : 1
    }).toArray(function(err1, doc1) {
        if (err1) {
            return res.send({
                "status" : {
                    "response" : "failure",
                    "message" : "err : " + err1,
                    "userMessage" : "There is some error. Please try again later"
                },"data" : {
                }
            });
        }
        if (doc1.length === 0) {
            return res.send({
                "status" : {
                    "response" : "failure",
                    "message" : "err : " + err1,
                    "userMessage" : "Email of the buddy you entered is not in our db. Please try again"
                },"data" : {
                }
            });
        }
        collection.update({
            "name" : name
        },{
            $set: {
                "name" :  name,
                "createdFor" : createdFor,
                "createdBy" : createdBy
            }
        },{
            upsert: true
        }, function (err) {
            if (err) {
                return res.send({
                "status" : {
                    "response" : "failure",
                    "message" : "err : " + err,
                    "userMessage" : "There is some error. Please try again later"
                },"data" : {
                }
            }); 
            } else {
                return res.send({
                    "status" : {
                        "response" : "success",
                        "message" : "",
                        "userMessage" : "New List has been created successfully"
                    },"data" : {
                    }
                });
            }
        }); 
    });
    
});

router.post('/addNewTask', function(req, res, next) {
    var createdFor = req.body.createdFor;
    var createdBy = req.body.createdBy;
    var name = req.body.name;
    var task_name = req.body.task_name; 
    var tmpObj = {
        "taskName" : task_name,
        "status" : "new"
    };
    var collection = db.getCollection("lists");
    collection.update({
        "createdFor" : createdFor,
        "createdBy" : createdBy,
        "name" : name
    },{
        $push : {
            "tasks" : tmpObj
        }
    },{
        upsert: true
    }, function (err) {
        if (err) {
            return res.send({
            "status" : {
                "response" : "failure",
                "message" : "err : " + err,
                "userMessage" : "There is some error. Please try again later"
            },"data" : {
            }
        }); 
        } else {
            return res.send({
                "status" : {
                    "response" : "success",
                    "message" : "",
                    "userMessage" : "New task has been added successfully"
                },"data" : {
                }
            });
        }
    }); 
});

router.post('/markItDone', function(req, res, next) {
    console.log(req.body);
    var createdFor = req.body.createdFor;
    var name = req.body.name;
    var taskName = req.body.taskName;
    var collection = db.getCollection("lists");
    collection.find({
        "createdFor" : createdFor,
        "name" : name
    },{
        "tasks" : 1, "name" : 1, "createdFor" : 1
    }).toArray(function(err, docs) {
        if (err) {
            return res.send({
                "status" : {
                    "response" : "failure",
                    "message" : "err : " + err,
                    "userMessage" : "There is some error. Please try again later"
                },"data" : {
                }
            });
        }
        var tempIndex = 0;
        for (var i = 0; i < docs[0].tasks.length; i++) {
            if (taskName === docs[0].tasks[i].taskName) {
                tempIndex = i;
                break;
            }
        }
        
        var set = {};
        set["tasks." + tempIndex + ".status"] = "done";
        collection.update({
            "createdFor" : createdFor,
            "name" : name
        },{
            $set : set
        },{
            upsert: true
        }, function (err1) {
            if (err) {
                return res.send({
                "status" : {
                    "response" : "failure",
                    "message" : "err : " + err1,
                    "userMessage" : "There is some error. Please try again later"
                },"data" : {
                }
            }); 
            } else {
                return res.send({
                    "status" : {
                        "response" : "success",
                        "message" : "",
                        "userMessage" : "Task has been marked done successfully"
                    },"data" : {
                    }
                });
            }
        }); 

    });
});

router.post('/myBuddies', function(req, res, next) {
    var email = req.body.email;
    var collection = db.getCollection("lists");
    collection.find({
        "createdBy" : email
    },{

    }).toArray(function(err, docs) {
        if (err) {
            return res.send({
                "status" : {
                    "response" : "failure",
                    "message" : "err : " + err,
                    "userMessage" : "There is some error. Please try again later"
                },"data" : {
                }
            }); 
        }
        return res.send({
            "status" : {
                "response" : "success",
                "message" : "",
                "userMessage" : ""
            },"data" : docs
        });
    })
});
module.exports = router;