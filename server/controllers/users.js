var db = require('../config/database');
var ObjectId = require("mongojs").ObjectId;

module.exports.getUsers = function(req, res) {
  db.users.find({}, function(err, users) {
    res.send(users);
  });
};

module.exports.addUser = function(req, res, next) {
  validate(req, function(err, user) {
    if (err) {
      return sendError(err, res);
    } else {
      insert(user, res);
    }
  });
};

module.exports.updateUser = function(req, res, next) {
  validate(req, function(err, user) {
    if (err) {
      return sendError(err, res);
    } else {
      update(user, res);
    }
  });
};


function validate(req, callback) {
  var user = req.body;

  var err = validateRequiredFields(user);
  if (err) {
    return callback(err, user);
  }

  db.users.findOne({
      "_id": {
        $ne: ObjectId(user._id)
      },
      "username": user.username
    },
    function(err, found) {
      if (found) {
        err = new Error('User ' + found.username + ' already exists');
      }
      callback(err, user);
    });
}

function validateRequiredFields(user) {
  if (!user.username) {
    return new Error('Username is required');
  }

  if (!user.firstName) {
    return new Error('First Name is required');
  }

  if (!user.lastName) {
    return new Error('Last Name is required');
  }
}


function insert(user, res) {
  db.users.insert(user, function(err, user) {
    if (err) {
      return sendError(err, res);
    }
    res.status(200);
    return res.send(user);
  });
}

function update(user, res) {
  db.users.update({
    _id: ObjectId(user._id)
  }, {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username
  }, {}, function(err, something) {
    if (err) {
      return sendError(err, res);
    }
    res.status(200);
    return res.send(user);
  });
}

function sendError(err, res) {
  res.status(400);
  res.send({
    reason: err.toString()
  });
}