const Router = require("express").Router();

const PublicationModel = require("../../database/publication");

/*
  Route           /publications
  Description     get all publications
  Access          PUBLIC
  Parameters      NONE
  Method          GET
  */
Router.get("/", async (req, res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json({ publications: getAllPublications });
});

/*
  Route           /publications
  Description     get specific publications 
  Access          PUBLIC
  Parameters      Publication
  Method          GET
  */

Router.get("/:publications", async (req, res) => {
  /*   const getSpecificPublication = database.publications.filter(
      (publication) => publication.id == req.params.publications
    ); */

  const getSpecificPublication = await PublicationModel.findOne({
    id: parseInt(req.params.publications),
  }).catch((err) => console.log(err));

  if (!getSpecificPublication) {
    return res.json({
      error: `No Publication found as ${req.params.publications}`,
    });
  }

  return res.json({ publication: getSpecificPublication });
});

/*
  Route           /publication
  Description     get a list of publications based on a book's ISBN
  Access          PUBLIC
  Parameters      isbn
  Method          GET
  */
Router.get("/ISBN/:isbn", async (req, res) => {
  /*   const getSpecificPublications = database.publications.filter((publication) =>
      publication.books.includes(req.params.isbn)
    ); */

  const getSpecificPublications = await PublicationModel.findOne({
    books: req.params.isbn,
  }).catch((err) => console.log(err));

  if (!getSpecificPublications) {
    return res.json({
      error: `No Publication found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ publication: getSpecificPublications });
});

/*
Route           /publication/new
Description     add new Publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/
Router.post("/publication/new", async (req, res) => {
  const { newpublication } = req.body;
  //database.publications.push(newpublication);
  PublicationModel.create(newpublication);
  return res.json({ message: "Publication was added!" });
});

/*
Route           /book/publication/id
Description     update apublication
Access          PUBLIC
Parameters      publicationID
Method          PUT
*/
Router.put("/book/publication/name/:id", async (req, res) => {
  const updatedPublications = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(req.params.id),
    },
    {
      name: req.body.PublicationName,
    },
    {
      new: true,
    }
  );

  /*   database.publications.forEach((publication) => {
      if (publication.id === parseInt(req.params.id)) {
        publications.name = req.body.publicationname;
        return;
      }
    }); */

  return res.json({ publication: updatedPublications });
});

/*
  Route           /publication/update/book
  Description     update/add new book to a publication
  Access          PUBLIC
  Parameters      isbn
  Method          PUT
  */
Router.put("/publication/update/book/:isbn", async (req, res) => {
  // update the publication database
  const updatedpublication = await PublicationModel.findOneAndUpdate(
    {
      id: req.body.pubId,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );

  /*   database.publications.forEach((publication) => {
      if (publication.id === req.body.pubId) {
        return publication.books.push(req.params.isbn);
      }
    }); */

  // update the book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        Publication: req.body.pubId,
      },
    },
    {
      new: true,
    }
  );

  /*   database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        book.publication = req.body.pubId;
        return;
      }
    }); */

  return res.json({
    books: updatedBook,
    publications: updatedpublication,
    message: "Successfully updated publication",
  });
});

/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
Router.delete("/publication/delete/book/:isbn/:pubId", async (req, res) => {
  // update publication database
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(req.params.pubId),
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );

  /* database.publications.forEach((publication) => {
      if (publication.id === parseInt(req.params.pubId)) {
        const newBooksList = publication.books.filter(
          (book) => book !== req.params.isbn
        );
  
        publication.books = newBooksList;
        return;
      }
    }); */

  // update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      publication: 0,
    },
    { new: true }
  );

  /* database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        book.publication = 0; // no publication available
        return;
      }
    }); */

  return res.json({
    books: updatedBook,
    publications: updatedPublication,
  });
});

/*
  Route           /publication/delete
  Description     delete a publication
  Access          PUBLIC
  Parameters      publicationID
  Method          DELETE
  */
Router.delete("/publication/delete/:id", async (req, res) => {
  const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });

  /* const updatedPublicationDatabase = database.publications.filter(
      (publication) => publication.id !== parseInt(req.params.id)
    );
  
    database.publications = updatedPublicationDatabase; */
  return res.json({ publications: updatedPublicationDatabase });
});

module.exports = Router;
