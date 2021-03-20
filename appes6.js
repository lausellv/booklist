// before we had to UI , but now we will have two classes instead

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');

    // create a tr element
    const row = document.createElement('tr');
    // insert calls
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class='delete'>X</a></td>
    `;

    list.appendChild(row);
  }

  showAlert(message, className) {
    // create div
    const div = document.createElement('div');
    // add classes
    div.className = `alert ${className}`;
    //add text
    div.appendChild(document.createTextNode(message));
    // we need to insert it into the DOM
    // get parent
    const container = document.querySelector('.container');
    // get form

    const form = document.querySelector('#book-form');
    // insert alert into the container before the form
    container.insertBefore(div, form);

    // timeout after 4
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 4000);
  }

  deleteBook(target) {if (target.className === 'delete') {
    target.parentElement.parentElement.remove();
  }}

  clearFields() { document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';}
}

// local storage class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => {
      const ui = new UI();

      // add book to UI
      ui.addBookToList(book);
    });
  }
  // we are using the class name bc it's a static method, no need to instantiate it
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    console.log(isbn);
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if(book.isbn === isbn){
        books.splice(index, 1);
      }

      
    });

    localStorage.setItem('books', JSON.stringify(books));

  }
}

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);


// event listener for add book
document
  .getElementById('book-form')
  .addEventListener('submit', function (event) {
    // get form values
    const title = document.getElementById('title').value,
      author = document.getElementById('author').value,
      isbn = document.getElementById('isbn').value;

    //instantiating a book
    const book = new Book(title, author, isbn);

    // instantiate a UI object
    const ui = new UI();

    console.log(ui);

    // Validate to make sure no empty fields are submitted
    if (title === '' || author === '' || isbn === '') {
      // error alert
      ui.showAlert('Please fill in all fields', 'error');
    } else {
      // add book to list
      ui.addBookToList(book); //we need to pass in the book object
// add to local storage
Store.addBook(book);
      // show success
      ui.showAlert('Book Added!', 'success');

      // Clear fields ui protocol
      ui.clearFields();
    }

    event.preventDefault();
  });

// event listener for Delete  // event delegation

document.getElementById('book-list').addEventListener('click', function (e) {
  // instantiate a UI object
  const ui = new UI();

  // delete book
  ui.deleteBook(e.target);
// remove from local storage
Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  // show an alert once we delete
  ui.showAlert('Book Removed', 'success');
  e.preventDefault();
});
