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
      console.log('this error comes from the async handler')
      res.render('error');
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
 // try {
    book = await Book.create(req.body);
    console.log(req.body)
    res.redirect("/books/" + book.id);
 // } catch (error) {
    // if(error.name === "SequelizeValidationError") {
    //   book = await Book.build(req.body);
    //   res.render("new-book", { book, errors: error.errors})
    // } else {
    //   throw error;
    // }  
 // }
}));


/* Update book form. */
router.get("/:id", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
 // if(book) {
    res.render("book-detail", { book });      
  // } else {
  //   res.sendStatus(404);
  //   res.render('error');
  // }
}));


/* Update a book. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/books/' + book.id); 
    } else {
      res.sendStatus(404).render('error');
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("book-detail", { book, errors: error.errors})
    } else {
      throw error;
    }
  }
}));


/* Delete individual book. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404).render('page-not-found');
  }
}));

module.exports = router;