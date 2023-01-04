const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// GET request to render the messages/index view
router.get("/", messageController.getMessages);

// GET request to render the messages/new view
router.get("/new", messageController.newMessage);

// POST request to create a new message and save it to the database
router.post("/", messageController.createMessage);

// GET request to render the messages/show view for a specific message
router.get("/:id", messageController.getMessage);

// GET request to render the messages/edit view for a specific message
router.get("/:id/edit", messageController.editMessage);

// POST request to update an existing message in the database
router.post("/:id", messageController.updateMessage);

// GET request to show all of the current users messages
router.get("/:userId/my-messages", messageController.myMessages);

// DELETE request to delete and existing message from the database
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
