const express = require("express");
const cors = require("cors");
const booksRouter = require("./routes/books");
const logger = require("./middleware/logger");

const app = express();
const PORT = 3000;


app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());
app.use(logger);

app.use("/api/books", booksRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`📚 Книжный магазин API запущен: http://localhost:${PORT}`);
});