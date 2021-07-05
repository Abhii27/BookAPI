const Router = require("express").Router();

const AuthorModel = require("../../database/author");

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/

Router.get("/", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ authors: getAllAuthors });
});

/*
  Route           /author
  Description     get specific author 
  Access          PUBLIC
  Parameters      Authors
  Method          GET
  */
Router.get("/:authors", async (req, res) => {
  /* const getSpecificAuthor = database.authors.filter(
      (author) => author.id == req.params.authors
    ); */

  const getSpecificAuthor = await AuthorModel.findOne({
    id: parseInt(req.params.authors),
  }).catch((err) => console.log(err));

  if (!getSpecificAuthor) {
    return res.json({
      error: `No Author found as ${req.params.authors}`,
    });
  }

  return res.json({ author: getSpecificAuthor });
});

/*
  Route           /authors
  Description     get a list of authors based on a book's ISBN
  Access          PUBLIC
  Parameters      isbn
  Method          GET
  */
Router.get("/ISBN/:isbn", async (req, res) => {
  /*   const getSpecificAuthors = database.authors.filter((author) =>
      author.books.includes(req.params.isbn)
    ); */

  const getSpecificAuthors = await AuthorModel.findOne({
    books: req.params.isbn,
  }).catch((err) => console.log(err));

  if (!getSpecificAuthors) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthors });
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
Router.post("/author/new", async (req, res) => {
  const { newAuthor } = req.body;
  //database.authors.push(newAuthor);

  AuthorModel.create(newAuthor);
  return res.json({ message: "author was added!" });
});

/*
Route           /book/author/id
Description     update author
Access          PUBLIC
Parameters      id
Method          PUT
*/
Router.put("/book/author/name/:id", async (req, res) => {
  const updatedAuthors = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.id),
    },
    {
      name: req.body.authorName,
    },
    {
      new: true,
    }
  );

  /* database.authors.forEach((author) => {
      if (author.id === parseInt(req.params.id)) {
        author.name = req.body.authorname;
        return;
      }
    }); */

  return res.json({ author: updatedAuthors });
});

/*
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameters      authorID
Method          DELETE
*/
Router.delete("/author/delete/:id", async (req, res) => {
  const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });

  /*   const updatedAuthorDatabase = database.authors.filter(
      (author) => author.id !== parseInt(req.params.id)
    );
    database.authors = updatedAuthorDatabase; */

  return res.json({ authors: updatedAuthorDatabase });
});

module.exports = Router;
