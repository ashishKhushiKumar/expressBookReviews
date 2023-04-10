const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if a user with the given username already exists
function doesExist(username) {
  return users.find(user => user.username === username);
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  const bookList = Object.values(books);
  return res.status(200).json(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  return res.status(200).json(book);
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const bookList = Object.values(books).filter((b) => b.author === req.params.author);
  if(bookList.length == 0) {
      return res.status(404).json({ message: 'No books by the given author'});
  }
  return res.status(200).json(bookList);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const bookList = Object.values(books).filter((b) => b.title === req.params.title);
  if(bookList.length == 0) {
      return res.status(404).json({ message: 'No books by the given title'});
  }
  return res.status(200).json(bookList);
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;

