const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const path = require("path");
const booksPath = path.join(__dirname, "../data/books.js");
let books = require(booksPath);

// GET /api/books
router.get("/", (req, res) => {
  res.json(books);
});

// GET /api/books/:id
router.get("/:id", (req, res) => {
const book = findById(req.params.id);
  
  if (!book) {
    return res.status(404).json({ error: "Книга не найдена" });
  }
  
  res.json(book);
});

// POST /api/books
router.post("/", (req, res) => {
 const { title, author, category, description, price, stock, rating, image } = req.body;
  if (!title || !price) {
    return res.status(400).json({ error: "Название и цена обязательны" });
  }

 const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
  
 const newBook = {
    id: newId,
    title,
    author: author || "Неизвестен",
    category: category || "другое",
    description: description || "",
    price: Number(price),
    stock: stock || 0,
    rating: rating || 0,
    image: image || "/images/default.jpg"
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// PATCH /api/books/:id
router.patch("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) return res.status(404).json({ error: "Книга не найдена" });

  const { title, author, category, description, price, stock, rating, image } = req.body;

  if (title) book.title = title;
  if (author) book.author = author;
  if (category) book.category = category;
  if (description) book.description = description;
  if (price) book.price = Number(price);
  if (stock !== undefined) book.stock = stock;
  if (rating) book.rating = rating;
  if (image) book.image = image;

  res.json(book);
});

// DELETE /api/books/:id
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: "Книга не найдена" });
  
  books.splice(index, 1);
  res.status(204).send();
});

module.exports = router;

