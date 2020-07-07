const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}


/* GET books table. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  //console.log(books);
  res.render("index", {books});
}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("new-book");
});

/* POST create book. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
}));

/* Update book form. */
router.get("/:id", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("book-detail", { book });      
  } else {
    res.sendStatus(404);
  }
}));

// /* GET individual book. */
// router.get("/books/:id", asyncHandler(async (req, res) => {
//   const book = await Book.findByPk(req.params.id);
//   if(book) {
//     res.render("books-detail", { book });  
//   } else {
//     res.sendStatus(404);
//   }
// })); 

/* Update a book. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/book-detail/" + books.id); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("book-detail", { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));

// /* Delete book form. */
// router.get("/books/:id/delete", asyncHandler(async (req, res) => {
//   const book = await Book.findByPk(req.params.id);
//   if(book) {
//     res.render("book-detail", { book, title: "Delete Book" });
//   } else {
//     res.sendStatus(404);
//   }
// }));

/* Delete individual book. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;