// frontend/js/main.js

async function loadBooks() {
  try {
    console.log(' Загружаем книги с сервера...');
    
    const response = await fetch('http://localhost:3000/api/books');
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const books = await response.json();
    console.log(' Книги с сервера:', books);
    
    // Отображаем первую книгу в карточке
    if (books.length > 0) {
      displayBook(books[0]);  // покажем первую книгу
    }
    
  } catch (error) {
    console.error(' Ошибка загрузки книг:', error.message);
  }
}

function displayBook(book) {
  // Находим элементы на странице
  const titleElement = document.querySelector('.product-card__title');
  const descElement = document.querySelector('.product-card__desc');
  const priceElement = document.querySelector('.product-card__price');
  const imageElement = document.querySelector('.product-card__image img');
  
  // Заполняем данными
  if (titleElement) {
    titleElement.textContent = `"${book.title}" ${book.author}`;
  }
  
  if (descElement) {
    descElement.textContent = book.description;
  }
  
  if (priceElement) {
    priceElement.textContent = `${book.price} ₽`;
  }
  
  if (imageElement && book.image) {
    // Путь к картинке: убираем первый слеш
    imageElement.src = `.${book.image}`; 
  }
}

// Запускаем после загрузки страницы
document.addEventListener('DOMContentLoaded', loadBooks);