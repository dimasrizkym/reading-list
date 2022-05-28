const UNCOMPELETED_BOOKSHELF_LIST = "incompleteBookshelfList";
const COMPELETED_BOOKSHELF_LIST = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function addBook() {
  const listUncompleted = document.getElementById(UNCOMPELETED_BOOKSHELF_LIST)
  const listCompleted = document.getElementById(COMPELETED_BOOKSHELF_LIST);

  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;

  const checkbox = document.getElementById("inputBookIsComplete");

  if(checkbox.checked){
    const book = makeBook(title, author, year, true);
    const bookObject = composeBookObject(title, author, year, true);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);
    listCompleted.append(book)
  }else {
    const book = makeBook(title, author, year, false);
    const bookObject = composeBookObject(title, author, year, false);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);
    listUncompleted.append(book);
  }

  updateDataToStorage();
}

function makeBook(title, author, year, isComplete) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = title;

  const tdAuthor = document.createElement("td");
  tdAuthor.innerText = "Penulis ";
  const tdColon = document.createElement("td");
  tdColon.innerText = " : ";
  const tdNameAuthor = document.createElement("td");
  tdNameAuthor.classList.add("author");
  tdNameAuthor.innerText = author;
  const tr = document.createElement("tr");
  tr.append(tdAuthor, tdColon, tdNameAuthor);

  const tdYear = document.createElement("td");
  tdYear.innerText = "Tahun Terbit ";
  const tdColon2 = document.createElement("td");
  tdColon2.innerText = " : ";
  const tdYearPublication = document.createElement("td");
  tdYearPublication.classList.add("yearPublication");
  tdYearPublication.innerText = year;
  const tr2 = document.createElement("tr");
  tr2.append(tdYear, tdColon2, tdYearPublication);

  const table = document.createElement("table");
  table.append(tr, tr2);


  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  if (isComplete) {
    buttonContainer.append(
      createGreenUndoButton(),
      createRedButton());
  } else {
    buttonContainer.append(
      createGreenCheckButton(),
      createRedButton());
  }

  const container = document.createElement("article");
  container.classList.add("book-item");
  container.append(bookTitle, table, buttonContainer);

  return container;
}

function createButton(buttonTypeClass , text, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.innerText = text;
  button.addEventListener("click", function (event) {
      eventListener(event);
  });
  return button;
}

function createGreenCheckButton() {
  return createButton("green", "Selesai dibaca", function(event){
    addBookToCompleted(event.target.parentElement.parentElement);
  });
}

function createGreenUndoButton() {
  return createButton("green", "Belum Selesai dibaca", function(event){
    undoBookFromCompleted(event.target.parentElement.parentElement);
  });
}

function createRedButton() {
  return createButton("red", "Hapus Buku", function(event){
      removeBookFromCompleted(event.target.parentElement.parentElement);
  });
}

function addBookToCompleted(bookContent) {
  const bookTitle = bookContent.querySelector(".book-item > h3").innerText;
  const bookAuthor = bookContent.querySelector(".book-item > table tr td.author").innerText;
  const publicationYear = bookContent.querySelector(".book-item > table tr td.yearPublication").innerText;

  const newContainer = makeBook(bookTitle, bookAuthor, publicationYear, true);
  const book = findBook(bookContent[BOOK_ITEMID]);
  book.isComplete = true;
  newContainer[BOOK_ITEMID] = book.id;

  const listCompleted = document.getElementById(COMPELETED_BOOKSHELF_LIST);
  listCompleted.append(newContainer);

  bookContent.remove();

  updateDataToStorage();
} 

function undoBookFromCompleted(bookContent) {
  const bookTitle = bookContent.querySelector(".book-item > h3").innerText;
  const bookAuthor = bookContent.querySelector(".book-item > table tr td.author").innerText;
  const publicationYear = bookContent.querySelector(".book-item > table tr td.yearPublication").innerText;

  const newContainer = makeBook(bookTitle, bookAuthor, publicationYear, false);

  const book = findBook(bookContent[BOOK_ITEMID]);
  book.isComplete = false;
  newContainer[BOOK_ITEMID] = book.id;

  const listUncompleted = document.getElementById(UNCOMPELETED_BOOKSHELF_LIST);
  listUncompleted.append(newContainer);

  bookContent.remove();

  updateDataToStorage();
} 

function removeBookFromCompleted(bookElement) {
  const confirmRemove = confirm("Anda yakin untuk menghapus data buku?\ndata tidak dapat dipulihkan kembali!")

  if (confirmRemove){
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);
  
    bookElement.remove();
    updateDataToStorage();
    setTimeout(function(){
      alert("data sudah terhapus")
    }, 300);
  }
}