var db = require('../config/database');
var ObjectId = require("mongojs").ObjectId;

module.exports.getUsers = function(req, res) {
  db.users.find({}, {
    salt: 0,
    hashedPassword: 0
  }, function(err, users) {
    res.send(users);
  });
};

module.exports.getUserById = function(req, res) {
  db.users.findOne({
    _id: ObjectId(req.params.id)
  }, {
    salt: 0,
    hashedPassword: 0
  }, function(err, user) {
    if (user) {
      res.send(user);
    } else {
      res.status(404);
      res.send();
    }
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
      update(req.params.id, user, res);
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
    res.status(200); // NOTE: 201 may be more appropriate.
    return res.send(user);
  });
}

function update(id, userData, res) {
  db.users.update({
    _id: ObjectId(id)
  }, {
    $set: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username
    }
  }, {}, function(err) {
    if (err) {
      return sendError(err, res);
    }
    res.status(200);
    return res.send(userData);
  });
}

function sendError(err, res) {
  res.status(400);
  res.send({
    reason: err.toString()
  });
}