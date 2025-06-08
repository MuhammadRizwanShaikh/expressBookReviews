const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  const user = users.find(user => user.username === username && user.password === password);
  
  if (user) {

    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 }); 

    req.session.authorization = {
      accessToken: accessToken,
      username: username
    };

    return res.status(200).json({
      message: "User successfully logged in",
      username: username,
      accessToken: accessToken
    });
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({message: "Review is required"});
  }

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  books[isbn].reviews[username] = review;   

  return res.status(200).json({
    message: "Review added/modified successfully",
    isbn: isbn,
    username: username,
    review: review
});

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({message: "Review not found for this user"});
    }
  
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully",
      isbn: isbn,
      username: username
    });

  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
