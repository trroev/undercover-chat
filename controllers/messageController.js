const Message = require("../models/message");

// create a message and save it to the database
exports.createMessage = (req, res, next) => {
  // create a new message object with the provided title, text, and user ID
  const message = new Message({
    title: req.body.title,
    text: req.body.text,
    user: req.user._id,
  });
  // save the message to the database
  message.save((err) => {
    // handle any errors
    if (err) {
      return next(err);
    }
    // redirect to the messages page
    res.redirect("/messages");
  });
};

// render the messages/new view with a new, empty Message object
exports.newMessage = (req, res) => {
  res.render("messages/new", {
    title: "New Message",
    message: new Message(),
    user: req.user,
    currentUser: req.user,
  });
};

// retrieve all messages from the database and render them in the messages/index view
exports.getMessages = (req, res, next) => {
  // find all messages in the database
  Message.find({})
    // populate the user field with the corresponding user documents
    .populate("user")
    .exec((err, messages) => {
      // handle any errors
      if (err) {
        return next(err);
      }
      // render the messages/idex view with the messages
      res.render("messages/", {
        title: "Message Board",
        user: req.user,
        currentUser: req.user,
        messages: messages,
      });
    });
};

// retrieve a single message from the database and render it in the messages/show view
exports.getMessage = (req, res, next) => {
  // find the message with the specified ID in the database
  Message.findById(req.params.id)
    // populate the user field with the corresponding user document
    .populate("user")
    .exec((err, message) => {
      // handle any errors
      if (err) {
        return next(err);
      }
      // render the message/show view with the message
      res.render("messages/show", {
        title: message.title,
        currentUser: req.user,
        message: message,
        user: req.user,
        success: req.flash("success"),
      });
    });
};

// edit a specific message in the database
exports.editMessage = (req, res, next) => {
  // find the message with the specified ID in the database
  Message.findById(req.params.id, (err, message) => {
    // handle any errors
    if (err) {
      return next(err);
    }
    // render the messages/edit view with the message
    res.render("messages/edit", {
      title: `Edit Message: ${message.title}`,
      message: message,
      user: req.user,
      currentUser: req.user,
    });
  });
};

// update an existing message in the database
exports.updateMessage = (req, res, next) => {
  // find the message with the specified ID and update its properties with the provided data
  Message.findByIdAndUpdate(req.params.id, req.body, (err) => {
    // handle any errors
    if (err) {
      return next(err);
    }
    // set a flash message
    req.flash("success", "Message updated successfully!");
    // redirect to the message page
    res.redirect(`/messages/${req.params.id}`);
  });
};

// show the current users messages that they have created
exports.myMessages = (req, res, next) => {
  // find all messages created by the currently authenticated user
  Message.find({ user: req.user }, (err, messages) => {
    // handle any errors
    if (err) {
      return next(err);
    }
    // render the my-messages view, passing the messages as the data
    res.render("messages/my-messages", {
      title: `${req.user.username}'s Messages`,
      messages: messages,
      user: req.user,
      currentUser: req.user,
    });
  });
};

// delete an existing message in the database
exports.deleteMessage = (req, res, next) => {
  // find the message with the specified ID and remove it from the database
  Message.findByIdAndRemove(req.params.id, (err) => {
    // handle any errors
    if (err) {
      return next(err);
    }
    // redirect to the messages page
    res.redirect("/messages");
  });
};
