import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { getAll, search, update } from "./BooksAPI";
import Book from "./Book";

let currentlyReading_books = [];
let wantToRead_books = [];
let read_books = [];
let all_Books = [];
let searchResultsBooks = [];
let mergedBooks = [];
class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.getBooks = this.getBooks.bind(this);
    this.refreshBooks = this.refreshBooks.bind(this);
    this.searchForBooks = this.searchForBooks.bind(this);
    this.renderSearchBooks = this.renderSearchBooks.bind(this);
  }

  state = {
    showSearchPage: false,
    inputValue: ""
  };

  componentDidMount() {
    this.getBooks();
    this.searchForBooks("android");
  }

  refreshBooks(isSearch) {
    if (isSearch) {
      this.setState({ showSearchPage: false });
    }
    this.getBooks();
  }

  getBooks() {
    currentlyReading_books = [];
    wantToRead_books = [];
    read_books = [];
    all_Books = [];

    const pBooks = getAll();
    pBooks.then(
      result => {
        for (let property in result) {
          all_Books.push(result[property]);
          if (result[property].shelf === "currentlyReading") {
            currentlyReading_books.push(result[property]);
          } else if (result[property].shelf === "wantToRead") {
            wantToRead_books.push(result[property]);
          } else if (result[property].shelf === "read") {
            read_books.push(result[property]);
          }
        }
        this.setState({
          allBooks: all_Books
        });
      },
      reject => {
        console.log("Reason: " + reject);
      }
    );
  }

  searchForBooks(input) {
    let searchResults = search(input);
    let isUsersBooks = [];

    searchResults.then(
      searchresult => {
        if (!searchresult.error) {
          //merge books from search with users books
          const pBooks = getAll();
          pBooks.then(
            userbooks => {
              mergedBooks = searchresult.map(searchbook => {
                let findResult = userbooks.find(book => {
                  return searchbook.id === book.id;
                });
                if (findResult != undefined) {
                  update(searchbook, findResult.shelf);
                }
                return searchbook;
              });
            },
            reject => {
              console.log(reject);
            }
          );

          this.setState({ searchResults: mergedBooks });
          searchResultsBooks = this.state.searchResults.map((result, index) => {
            return <Book book={result} refresh={this.refreshBooks} />;
          });
        } else {
          this.setState({ searchResults: [] });
        }
      },
      reject => {
        console.log(reject);
      }
    );
    searchResults = null;
  }

  renderSearchBooks() {
    if (!this.state.searchResults.error) {
      return this.state.searchResults.map((result, index) => {
        // See if there are any books that are CRBs in the search books
        let filteredCRBs = currentlyReading_books.filter(crb => {
          return crb.id === result.id;
        });

        if (filteredCRBs.length > 0) {
          return (
            <li key={"search" + index}>
              <Book
                book={result}
                refresh={this.refreshBooks}
                isSearch={true}
                shelf={filteredCRBs[0].shelf}
              />
            </li>
          );
        }

        // Find WantToRead books
        let filteredWTR = wantToRead_books.filter(wtr => {
          return wtr.id === result.id;
        });

        if (filteredWTR.length > 0) {
          return (
            <li key={"search" + index}>
              <Book
                book={result}
                refresh={this.refreshBooks}
                isSearch={true}
                shelf={filteredWTR[0].shelf}
              />
            </li>
          );
        }

        // Find WantToRead books
        let filteredReadBooks = read_books.filter(readBook => {
          return readBook.id === result.id;
        });

        if (filteredReadBooks.length > 0) {
          return (
            <li key={"search" + index}>
              <Book
                book={result}
                refresh={this.refreshBooks}
                isSearch={true}
                shelf={filteredReadBooks[0].shelf}
              />
            </li>
          );
        }

        // Default Search books found
        return (
          <li key={"search" + index}>
            <Book book={result} refresh={this.refreshBooks} isSearch={true} />
          </li>
        );
      });
    }
  }

  render() {
    if (!this.state.searchResults) {
      return <p>Loading...</p>;
    } else {
      // Render search results
      searchResultsBooks = this.renderSearchBooks();
    }

    let show_crb = all_Books
      .filter(book => book.shelf === "currentlyReading")
      .map((result, index) => {
        return (
          <li key={"crbli" + index}>
            <Book book={result} refresh={this.refreshBooks} />
          </li>
        );
      });

    let show_wants = all_Books
      .filter(book => book.shelf === "wantToRead")
      .map((result, index) => {
        return (
          <li key={"wtrli" + index}>
            <Book book={result} refresh={this.refreshBooks} />
          </li>
        );
      });

    let show_read = all_Books
      .filter(book => book.shelf === "read")
      .map((result, index) => {
        return (
          <li key={"readli" + index}>
            <Book book={result} refresh={this.refreshBooks} />
          </li>
        );
      });

    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <Link
                to="/"
                className="close-search"
                onClick={() => this.setState({ showSearchPage: false })}
              >
                Close
              </Link>
              <input
                type="text"
                placeholder="Search by title or author"
                onChange={event => this.searchForBooks(event.target.value)}
              />
            </div>

            <div className="search-books-results">
              <ol className="books-grid">{searchResultsBooks}</ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">{show_crb}</ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">{show_wants}</ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">{show_read}</ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link
                to="/Search"
                onClick={() => this.setState({ showSearchPage: true })}
              >
                Add a book
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BooksApp;
