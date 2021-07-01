require("dotenv").config();

// Frame work
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database/index");

// Initializing express
const app = express();

// Configurations
app.use(express.json());

console.log(process.env.MONGO_URL);

// Establish Database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(console.log("mongodb connected successfully🚀🚀."))
  .catch((err) => console.log(err));

/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/
app.get("/", (req, res) => {
  return res.json({ books: database.books });
});

/*
Route           /is
Description     get specific book based on ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
app.get("/is/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No Book found for the ISBN of ${req.params.isbn}`,
    });
  }
  return res.json({ book: getSpecificBook });
});

/*
Route           /c
Description     get specific books based on a category
Access          PUBLIC
Parameters      category
Method          GET
*/
app.get("/c/:category", (req, res) => {
  const getSpecificBooks = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );

  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `No Book found for the Category of ${req.params.category}`,
    });
  }
  return res.json({ books: getSpecificBooks });
});

/*
Route           /authors
Description     get specific books based on a author
Access          PUBLIC
Parameters      authors
Method          GET
*/
app.get("/authors/:authors", (req, res) => {
  const getSpecificauthor = database.books.filter((book) =>
    book.authors.includes(parseInt(req.params.authors))
  );

  if (getSpecificauthor.length === 0) {
    return res.json({
      error: `No Book found with the Author name ${req.params.authors}`,
    });
  }

  return res.json({ authors: getSpecificauthor });
});

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/

app.get("/author", (req, res) => {
  return res.json({ authors: database.authors });
});

/*
Route           /author
Description     get specific author 
Access          PUBLIC
Parameters      Authors
Method          GET
*/
app.get("/auth/:authors", (req, res) => {
  const getSpecificAuthor = database.authors.filter((author) =>
  author.id == req.params.authors
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No Author found as ${req.params.authors}`,
    });
  }

  return res.json({ author: getSpecificAuthor });
});

/*
Route           /author
Description     get a list of authors based on a book's ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
app.get("/author/:isbn", (req, res) => {
  const getSpecificAuthors = database.authors.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthors.length === 0) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthors });
});

/*
  Route           /publications
  Description     get all publications
  Access          PUBLIC
  Parameters      NONE
  Method          GET
  */
app.get("/publications", (req, res) => {
  return res.json({ publications: database.publications });
});

/*
Route           /publications
Description     get specific publications 
Access          PUBLIC
Parameters      Publication
Method          GET
*/

app.get("/publications/:publications", (req, res) => {
  const getSpecificPublication = database.publications.filter((publication) =>
  publication.id == req.params.publications
  );

  if (getSpecificPublication.length === 0) {
    return res.json({
      error: `No Publication found as ${req.params.publications}`,
    });
  }

  return res.json({ publication: getSpecificPublication });
});

/*
Route           /publications
Description     get a list of publications based on a book's ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
app.get("/publications/:isbn", (req, res) => {
  const getSpecificPublications = database.publications.filter((publication) =>
    publication.books.includes(req.params.isbn)
  );

  if (getSpecificPublications.length === 0) {
    return res.json({
      error: `No Publication found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ publication: getSpecificPublications });
});

/*
Route           /book/new
Description     add new books
Access          PUBLIC
Parameters      NONE
Method          POST
*/
app.post("/book/new", (req, res) => {
  const { newBook } = req.body;
  database.books.push(newBook);
  return res.json({ books: database.books, message: "Book was added!" });
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
app.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;
  database.authors.push(newAuthor);
  return res.json({ authors: database.authors, message: "author was added!" });
});

/*
Route           /publication/new
Description     add new Publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/
app.post("/publication/new", (req, res) => {
  const { newpublication } = req.body;
  database.publications.push(newpublication);
  return res.json({
    publications: database.publications,
    message: "Publication was added!",
  });
});

/*
Route           /book/update
Description     update title of a book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
app.put("/book/update/:isbn", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.bookTitle;
      return;
    }
  });

  return res.json({ books: database.books });
});

/*
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
app.put("/book/author/update/:isbn", (req, res) => {
  // update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn)
      return book.authors.push(req.body.newAuthor);
  });
  // update the author database
  database.authors.forEach((author) => {
    if (author.id === req.body.newAuthor)
      return author.books.push(req.params.isbn);
  });

  return res.json({
    books: database.books,
    authors: database.authors,
    message: "New author was added 🚀",
  });
});

/*
Route           /book/author/authorid
Description     update author
Access          PUBLIC
Parameters      id
Method          PUT
*/
app.put("/book/author/name/:id", (req, res) => {
  database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.id)) {
      authors.name = req.body.authorname;
      return;
    }
  });

  return res.json({ author: database.authors });
});

/*
Route           /book/publication/id
Description     update apublication
Access          PUBLIC
Parameters      publicationID
Method          PUT
*/
app.put("/book/publication/name/:id", (req, res) => {
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.id)) {
      publications.name = req.body.publicationname;
      return;
    }
  });

  return res.json({ publication: database.publications });
});

/*
Route           /publication/update/book
Description     update/add new book to a publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
app.put("/publication/update/book/:isbn", (req, res) => {
  // update the publication database
  database.publications.forEach((publication) => {
    if (publication.id === req.body.pubId) {
      return publication.books.push(req.params.isbn);
    }
  });

  // update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
    message: "Successfully updated publication",
  });
});

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
app.delete("/book/delete/:isbn", (req, res) => {
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );

  database.books = updatedBookDatabase;
  return res.json({ books: database.books });
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          PUBLIC
Parameters      isbn, author id
Method          DELETE
*/
app.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
  // update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.authors.filter(
        (author) => author !== parseInt(req.params.authorId)
      );
      book.authors = newAuthorList;
      return;
    }
  });

  // update the author database
  database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBooksList = author.books.filter(
        (book) => book !== req.params.isbn
      );

      author.books = newBooksList;
      return;
    }
  });

  return res.json({
    message: "author was deleted!!!!!!😪",
    book: database.books,
    author: database.authors,
  });
});

/*
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameters      authorID
Method          DELETE
*/
app.delete("/author/delete/:id", (req, res) => {
  const updatedAuthorDatabase = database.authors.filter(
    (author) => author.id !== parseInt(req.params.id)
  );

  database.authors = updatedAuthorDatabase;
  return res.json({ authors: database.authors });
});

/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
app.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
  // update publication database
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );

      publication.books = newBooksList;
      return;
    }
  });

  // update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0; // no publication available
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
  });
});

/*
Route           /publication/delete
Description     delete a publication
Access          PUBLIC
Parameters      publicationID
Method          DELETE
*/
app.delete("/publication/delete/:id", (req, res) => {
  const updatedPublicationDatabase = database.publications.filter(
    (publication) => publication.id !== parseInt(req.params.id)
  );

  database.publications = updatedPublicationDatabase;
  return res.json({ publications: database.publications });
});

app.listen(3000, () => console.log("Server Running!!🚀"));
