/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	const newBN = document.querySelector('#newBookName').value;
	const newBA = document.querySelector('#newBookAuthor').value;
	const newBG = document.querySelector('#newBookGenre').value;
	const newBook = new Book(newBN, newBA, newBG);
	libraryBooks.push(newBook);
	console.log(newBook)

	// Call addBookToLibraryTable properly to add book to the DOM
	//TODO:
	addBookToLibraryTable(newBook)
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();
	// Get correct book and patron
	//Note: parseInt here, othewise type is wrong smh
	const loanBookId = parseInt(document.querySelector('#loanBookId').value);
	const loanCardNum = document.querySelector('#loanCardNum').value;
	// Add patron to the book's patron property
	libraryBooks[loanBookId].patron = patrons[loanCardNum]
	
	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(libraryBooks[loanBookId])
	// Start the book loan timer.
	libraryBooks[loanBookId].setLoanTime()

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	if (!(e.target.classList.contains('return'))) return;
	// Call removeBookFromPatronTable()
	const bookId = e.target.parentElement.parentElement.firstElementChild.innerText
	removeBookFromPatronTable(libraryBooks[bookId])

	// Change the book object to have a patron of 'null'
	libraryBooks[bookId].patron = null

}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const name = document.querySelector('#newPatronName').value
	const patron = new Patron(name)
	patrons.push(patron)

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(patron)

}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	const bookInfoId = bookInfoForm.querySelector('#bookInfoId').value
	// Call displayBookInfo()	
	displayBookInfo(libraryBooks[bookInfoId])
}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	let newRow = bookTable.insertRow(-1);
	//3 cells
	let rowBookId = newRow.insertCell(0);
	let rowTitle = newRow.insertCell(1);
	let rowCardNum = newRow.insertCell(2);
	// add bookId to cell
	rowBookId.appendChild(document.createTextNode((book.bookId).toString()))
	// add title to cell
	rowTitle.innerHTML = `<strong>${book.title}</strong>`;
	// add patron to cell
	let prt = book.patron;
	if (prt === null){
		ptr = ""
	}
	rowCardNum.appendChild(document.createTextNode(ptr));

	bookTable.appendChild(newRow)

}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
	bookInfo.children[0].children[0].childNodes[0].nodeValue = book.bookId;
	bookInfo.children[1].children[0].childNodes[0].nodeValue = book.title;
	bookInfo.children[2].children[0].childNodes[0].nodeValue = book.author;
	bookInfo.children[3].children[0].childNodes[0].nodeValue = book.genre;
	if (book.patron == null){
			bookInfo.children[4].children[0].childNodes[0].nodeValue = "N/A";
	}
	else{
			bookInfo.children[4].children[0].childNodes[0].nodeValue = book.patron.name;
	}
}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
	const patrons = patronEntries.children[book.patron.cardNumber];
	const patronTable = patrons.querySelector(".patronLoansTable");
	
	const newRow = document.createElement('tr')
	
	const newId = document.createElement('td')
	newId.appendChild(document.createTextNode(book.bookId))
	newRow.appendChild(newId)

	const newTitle = document.createElement('td')
	const strongElement = document.createElement("strong");
	strongElement.appendChild(document.createTextNode(book.title));
	newTitle.appendChild(strongElement);
	newRow.appendChild(newTitle)

	const newStatus = document.createElement('td')
	newStatus.appendChild(document.createTextNode('Within due date'))
	newStatus.style.color = 'green'
	newStatus.style.fontWeight = 'bold'
	newRow.appendChild(newStatus)

	const newReturn = document.createElement('td')
	const removeButton = document.createElement('button');
	removeButton.className = 'return'
	removeButton.appendChild(document.createTextNode('return'))
	newReturn.appendChild(removeButton)
	newRow.appendChild(newReturn)

	patronTable.children[0].appendChild(newRow)

	const tableRows = bookTable.getElementsByTagName('tr')
	const bookRow = tableRows[book.bookId + 1].getElementsByTagName('td')
	bookRow[2].appendChild(document.createTextNode(book.patron.cardNumber))
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
	const newPatron = document.createElement("div");
	newPatron.className = "patron";

	const pName = document.createElement("p");
	pName.appendChild(document.createTextNode("Name: "));
	pName.appendChild(document.createElement("span"));
	pName.children[0].className = "bold";
	pName.children[0].appendChild(document.createTextNode(patron.name));
	newPatron.appendChild(pName)

	const pCNum = document.createElement("p");
	pCNum.appendChild(document.createTextNode("Card Number: "));
	pCNum.appendChild(document.createElement("span"));
	pCNum.children[0].className = "bold";
	pCNum.children[0].appendChild(document.createTextNode(patron.cardNumber));
	newPatron.appendChild(pCNum)

	const onLoan = document.createElement("h4")
	onLoan.appendChild(document.createTextNode("Books on loan:"))
	newPatron.appendChild(onLoan)

	const newTable = document.createElement('table')
	newTable.className = 'patronLoansTable'
	newTable.appendChild(document.createElement('tbody'))
	newTable.children[0].appendChild(document.createElement("tr"));
	for(let i = 0; i < 4; i++){
		newTable.children[0].children[0].appendChild(document.createElement("th"));
	}
	newTable.children[0].children[0].children[0].appendChild(document.createTextNode("BookID"));
	newTable.children[0].children[0].children[1].appendChild(document.createTextNode("Title"));
	newTable.children[0].children[0].children[2].appendChild(document.createTextNode("Status"));
	newTable.children[0].children[0].children[3].appendChild(document.createTextNode("Return"));

	newPatron.appendChild(newTable)
	patronEntries.appendChild(newPatron)
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	const patronClass = patronEntries.children[book.patron.cardNumber]
	const patronTable = patronClass.querySelector(".patronLoansTable");
	const tbody = patronClass.getElementsByTagName('tbody')
	const headers = patronClass.getElementsByTagName('td')
	for (let i = 0; i < headers.length; i++) {
		if (headers[i].innerText == book.bookId) {
			const rowToRemove = headers[i].parentElement
			tbody[0].removeChild(rowToRemove)
		}
	}

	const tableRows = bookTable.getElementsByTagName('tr')
	tableRows[book.bookId + 1].lastElementChild.innerText = ''

}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	const patron = book.patron;
	const patronDiv = patronEntries.children[patron.cardNumber];
	const headers = patronDiv.getElementsByTagName('td')
	for (let i = 0; i < headers.length; i ++) {
		if (headers[i].innerText == book.bookId) {
			const row = headers[i].parentElement 
			const cols = row.getElementsByTagName('td')
			cols[2].innerText = 'Overdue'
			cols[2].style.color = 'red'
		}
		
	}

}

