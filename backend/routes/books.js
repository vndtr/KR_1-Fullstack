const express = require("express");
const router = express.Router();

let books = require("../data/books");

// Вспомогательная функция: найти книгу по id
function findById(id) {
  const num = Number(id);
  if (Number.isNaN(num)) return null;
  return books.find((b) => b.id === num) || null; 
}

// GET /api/books — список книг
router.get("/", (req, res) => {
  res.json(books);  
});

// GET /api/books/:id — одна книга
router.get("/:id", (req, res) => {
  const book = findById(req.params.id);
  if (!book) return res.status(404).json({ error: "Книга не найдена" });
  res.json(book);
});

// POST /api/books — добавить книгу
router.post("/", (req, res) => {
 
  const { title, author, description, price, image, year, genre } = req.body;

  // Валидация
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Название книги обязательно" });
  }
  
  const numPrice = Number(price);
  if (Number.isNaN(numPrice) || numPrice < 0) {
    return res.status(400).json({ error: "Цена должна быть положительным числом" });
  }

  // Вычисляем новый id
  const nextId = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
  
  // Создаем новую книгу
  const newBook = {
    id: nextId,
    title: title.trim(),
    author: author || "Неизвестен",
    description: description || "",
    price: numPrice,
    image: image || "/images/default.jpg",
    year: year || null,
    genre: genre || "другое"
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// PATCH /api/books/:id — обновить книгу
router.patch("/:id", (req, res) => {
  const book = findById(req.params.id);
  if (!book) return res.status(404).json({ error: "Книга не найдена" });

  const { title, author, description, price, image, year, genre } = req.body;

  // Обновляем только те поля, которые передали
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Название должно быть непустой строкой" });
    }
    book.title = title.trim();
  }

  if (author !== undefined) {
    book.author = author;
  }

  if (description !== undefined) {
    book.description = description;
  }

  if (price !== undefined) {
    const numPrice = Number(price);
    if (Number.isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ error: "Цена должна быть числом >= 0" });
    }
    book.price = numPrice;
  }

  if (image !== undefined) {
    book.image = image;
  }

  if (year !== undefined) {
    book.year = year;
  }

  if (genre !== undefined) {
    book.genre = genre;
  }

  res.json(book);
});

// DELETE /api/books/:id — удалить книгу
router.delete("/:id", (req, res) => {
  const before = books.length;
  const id = Number(req.params.id);
  
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID должен быть числом" });
  }

  
  books = books.filter(b => b.id !== id);

  if (books.length === before) {
    return res.status(404).json({ error: "Книга не найдена" });
  }

  res.json({ ok: true, message: "Книга удалена" });
});

module.exports = router;