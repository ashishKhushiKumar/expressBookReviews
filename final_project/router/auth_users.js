const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { // returns boolean
    // write code to check is the username is valid
    return users.filter((user) => user.username === username).length > 0;
}

const authenticatedUser = (username, password) => { // returns boolean
    // write code to check if username and password match the one we have in records.
    return users.filter((user) => user.username === username && user.password === password).length > 0;
}

// only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: "1h" });
        req.session.authorization = { accessToken, username };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    const username = req.body.username;
    const review = book.reviews[username];

    if (!review) {
        return res.status(404).json({ message: 'Review deleted successfully' });
    }

    delete book.reviews[username];

    return res.status(200).json({ message: 'Review deleted successfully' });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.query.review;
    const isbn = req.params.isbn;
    const book = books[isbn];
    const username = req.body.username;

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (!review) {
        return res.status(400).json({ message: 'Please provide review' });
    }

    if (!username) {
        return res.status(400).json({ message: 'Please provide username' });
    }

    book[username] = review;

    return res.status(200).json({ message: 'Book review added successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
