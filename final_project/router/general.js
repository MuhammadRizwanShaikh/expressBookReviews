const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }


  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({message: "User registered successfully"});

});

function getBooksUsingPromise() {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          resolve(books);
        }, 100);
      } catch (error) {
        reject(error);
      }
    });
  }

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  //return res.status(200).json(JSON.stringify(books,null,2))
  getBooksUsingPromise()
  .then((booksList) => {
      return res.status(200).json(booksList);
  })
  .catch((error) => {
      return res.status(500).json({message: "Error retrieving books"});
  });
});
function getBooksDetailsUsingPromise() {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          resolve(books);
        }, 100);
      } catch (error) {
        reject(error);
      }
    });
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  getBooksDetailsUsingPromise()
      .then((booksList) => {  
          if (booksList[isbn]) {
              return res.status(200).json(booksList[isbn]);
          } else {
              return res.status(404).json({message: "Book not found"});
          }
      })
      .catch((error) => {
          return res.status(500).json({message: "Error retrieving book details"});
      });
});

function getBooksByAuthorUsingPromise(author) {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                const booksByAuthor = {};
                for (let isbn in books) {
                    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                        booksByAuthor[isbn] = books[isbn];
                    }
                }
                resolve(booksByAuthor);
            }, 100);
        } catch (error) {
            reject(error);
        }
    });
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    const author = req.params.author;
    getBooksByAuthorUsingPromise(author)
    .then((booksByAuthor) => {
        if (Object.keys(booksByAuthor).length > 0) {
            return res.status(200).json({
                author: author,
                books: booksByAuthor
            });
        } else {
            return res.status(404).json({
                message: `No books found by author: ${author}`
            });
        }
    })
    .catch((error) => {
        return res.status(500).json({
            message: "Error retrieving books by author",
            error: error.message
        });
    });
});

function getBooksByTitleUsingPromise(title) {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                const booksByTitle = {};
                for (let isbn in books) {
                    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
                        booksByTitle[isbn] = books[isbn];
                    }
                }
                resolve(booksByTitle);
            }, 100);
        } catch (error) {
            reject(error);
        }
    });
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    const author = req.params.author;
    getBooksByAuthorUsingPromise(author)
    .then((booksByAuthor) => {
        if (Object.keys(booksByAuthor).length > 0) {
            return res.status(200).json({
                author: author,
                books: booksByAuthor
            });
        } else {
            return res.status(404).json({
                message: `No books found by author: ${author}`
            });
        }
    })
    .catch((error) => {
        return res.status(500).json({
            message: "Error retrieving books by author",
            error: error.message
        });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const title  = req.params.title;
    getBooksByTitleUsingPromise(title)
      .then((booksByTitle) => {
          if (Object.keys(booksByTitle).length > 0) {
              return res.status(200).json({
                  author: author,
                  books: booksByTitle
              });
          } else {
              return res.status(404).json({
                  message: `No books found by title: ${title}`
              });
          }
      })
      .catch((error) => {
          return res.status(500).json({
              message: "Error retrieving books by title",
              error: error.message
          });
      });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
    



});

module.exports.general = public_users;
