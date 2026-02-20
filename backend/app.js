const express = require("express");
const cors = require("cors");
const path = require("path");

const logger = require("./middleware/logger");
const booksRouter = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: разрешаем запросы с фронта (на практике можно обсудить CORS)
app.use(cors());

// Middleware: чтобы читать JSON из тела запроса (req.body)
app.use(express.json());

// Собственный logger для наглядности
app.use(logger);

// Раздаем статические файлы (картинки) из папки images
app.use('/images', express.static(path.join(__dirname, '../images')));

// Healthcheck / главная
app.get("/", (req, res) => {
  res.json({
    message: "Добро пожаловать в книжный магазин",
    endpoints: {
      allBooks: "GET /api/books",
      oneBook: "GET /api/books/:id",
      createBook: "POST /api/books",
      updateBook: "PATCH /api/books/:id",
      deleteBook: "DELETE /api/books/:id"
    }
  });
});
// Роуты API
app.use("/api/books", booksRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
    console.log(`Книжный магазин запущен: http://localhost:${PORT}`);
  console.log(`API книг: http://localhost:${PORT}/api/books`);
});
