import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { getAll, search } from "./BooksAPI";
import Book from "./Book";

let currentlyReading_books = [];

let wantToRead_books = [];
let read_books = [];
let searchResultsBooks = [];

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.getBooks = this.getBooks.bind(this);
    this.refreshBooks = this.refreshBooks.bind(this);
  }

  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false
  };

  componentDidMount() {
    this.getBooks();

    let searchResults = search("Android");

    searchResults.then(
      result => {
        this.setState({ searchResults: result });
        searchResultsBooks = this.state.searchResults.map((result, index) => {
          return <Book key={index} book={result} />;
        });
      },
      error => {
        console.log(error);
      }
    );
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
    const pBooks = getAll();
    pBooks.then(
      result => {
        for (let property in result) {
          // console.log(result[property].shelf);

          if (result[property].shelf === "currentlyReading") {
            currentlyReading_books.push(result[property]);
          } else if (result[property].shelf === "wantToRead") {
            wantToRead_books.push(result[property]);
          } else {
            read_books.push(result[property]);
          }
        }
        this.setState({
          currentlyReadingBooks: currentlyReading_books,
          wantToReadBooks: wantToRead_books,
          readBooks: read_books
        });
      },
      reason => {
        console.log("Reason: ");
        console.log(reason);
      }
    );
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      // console.log("Enter key pressed");
      // console.log(e.target.value);

      let searchResults = search(e.target.value);
      // console.log(searchResults);
      searchResults.then(
        result => {
          this.setState({ searchResults: result });
        },
        error => {
          console.log(error);
        }
      );
    }
  };

  render() {
    if (!this.state.searchResults) {
      return <p>Loading...</p>;
    } else {
      searchResultsBooks = this.state.searchResults.map((result, index) => {
        
        // See if there are any books that are CRBs in the search books
        let filteredCRBs = currentlyReading_books.filter(crb => {
          return crb.id === result.id;
        });

        if (filteredCRBs.length > 0) {
          // console.log(filteredCRBs);
          return (
            <li key={"search" + index}>
              <Book
                key={index}
                book={result}
                refresh={this.refreshBooks}
                isSearch={true}
                shelf={filteredCRBs[0].shelf}
              />
            </li>
          );
        }

        return (
          <li key={"search" + index}>
            <Book
              key={index}
              book={result}
              refresh={this.refreshBooks}
              isSearch={true}
            />
          </li>
        );
      });
    }

    let show_crb = currentlyReading_books.map((result, index) => {
      return (
        <li key={"crbli" + index}>
          <Book key={"crb" + index} book={result} refresh={this.refreshBooks} />
        </li>
      );
    });

    let show_wants = wantToRead_books.map((result, index) => {
      return (
        <li key={"wtrli" + index}>
          <Book key={"wtr" + index} book={result} refresh={this.refreshBooks} />
        </li>
      );
    });

    let show_read = read_books.map((result, index) => {
      return (
        <li key={"readli" + index}>
          <Book
            key={"read" + index}
            book={result}
            refresh={this.refreshBooks}
          />
        </li>
      );
    });

    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a
                className="close-search"
                onClick={() => this.setState({ showSearchPage: false })}
              >
                Close
              </a>
              <div className="search-books-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by title or author"
                  onKeyPress={this.handleKeyPress}
                />
              </div>
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
              <a onClick={() => this.setState({ showSearchPage: true })}>
                Add a book
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BooksApp;
