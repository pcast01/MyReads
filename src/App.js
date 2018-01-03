import React from "react";
import "./App.css";
import { getAll, search } from "./BooksAPI";
import Book from "./Book";
import Downshift from "downshift";

let currentlyReading_books = [];

let wantToRead_books = [];
let read_books = [];
let searchResultsBooks = [];
let searchTerms = [
  "Android",
  "Art",
  "Artificial Intelligence",
  "Astronomy",
  "Austen",
  "Baseball",
  "Basketball",
  "Bhagat",
  "Biography",
  "Brief",
  "Business",
  "Camus",
  "Cervantes",
  "Christie",
  "Classics",
  "Comics",
  "Cook",
  "Cricket",
  "Cycling",
  "Desai",
  "Design",
  "Development",
  "Digital Marketing",
  "Drama",
  "Drawing",
  "Dumas",
  "Education",
  "Everything",
  "Fantasy",
  "Film",
  "Finance",
  "First",
  "Fitness",
  "Football",
  "Future",
  "Games",
  "Gandhi",
  "Homer",
  "Horror",
  "Hugo",
  "Ibsen",
  "Journey",
  "Kafka",
  "King",
  "Lahiri",
  "Larsson",
  "Learn",
  "Literary Fiction",
  "Make",
  "Manage",
  "Marquez",
  "Money",
  "Mystery",
  "Negotiate",
  "Painting",
  "Philosophy",
  "Photography",
  "Poetry",
  "Production",
  "Programming",
  "React",
  "Redux",
  "River",
  "Robotics",
  "Rowling",
  "Satire",
  "Science Fiction",
  "Shakespeare",
  "Singh",
  "Swimming",
  "Tale",
  "Thrun",
  "Time",
  "Tolstoy",
  "Travel",
  "Ultimate",
  "Virtual Reality",
  "Web Development",
  "iOS"
];

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.getBooks = this.getBooks.bind(this);
    this.refreshBooks = this.refreshBooks.bind(this);
    this.searchForBooks = this.searchForBooks.bind(this);
  }

  state = {
    showSearchPage: false,
    inputValue: ""
  };

  componentDidMount() {
    searchTerms = searchTerms.map(result => {
      return result.toLowerCase();
    });
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
    const pBooks = getAll();
    pBooks.then(
      result => {
        for (let property in result) {
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
        console.log("Reason: " + reason);
      }
    );
  }

  searchForBooks(input) {
    let searchResults = search(input);

    searchResults.then(
      result => {
        this.setState({ searchResults: result });
        searchResultsBooks = this.state.searchResults.map((result, index) => {
          return <Book book={result} refresh={this.refreshBooks} />;
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    if (!this.state.searchResults) {
      return <p>Loading...</p>;
    } else {
      // Render search results
      searchResultsBooks = this.state.searchResults.map((result, index) => {
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

    let show_crb = currentlyReading_books.map((result, index) => {
      return (
        <li key={"crbli" + index}>
          <Book book={result} refresh={this.refreshBooks} />
        </li>
      );
    });

    let show_wants = wantToRead_books.map((result, index) => {
      return (
        <li key={"wtrli" + index}>
          <Book book={result} refresh={this.refreshBooks} />
        </li>
      );
    });

    let show_read = read_books.map((result, index) => {
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
              <a
                className="close-search"
                onClick={() => this.setState({ showSearchPage: false })}
              >
                Close
              </a>
              <Downshift
                onChange={selection => this.searchForBooks(selection)}
                render={({
                  getInputProps,
                  getItemProps,
                  isOpen,
                  inputValue,
                  highlightedIndex,
                  selectedItem
                }) => (
                  <div className="search-books-input-wrapper">
                    <input
                      {...getInputProps()}
                      style={{
                        width: "100%",
                        padding: "15px 10px",
                        fontSize: "1.25em",
                        border: "none",
                        outline: "none"
                      }}
                      placeholder="Search by title or author"
                    />
                    {isOpen ? (
                      <div>
                        {searchTerms
                          .filter(
                            i =>
                              !inputValue.toLowerCase() ||
                              i.includes(inputValue.toLowerCase())
                          )
                          .map((item, index) => (
                            <div
                              {...getItemProps({
                                key: item,
                                index,
                                item,
                                style: {
                                  backgroundColor:
                                    highlightedIndex === index
                                      ? "lightgray"
                                      : "white",
                                  fontWeight:
                                    selectedItem === item ? "bold" : "normal"
                                }
                              })}
                            >
                              {item}
                            </div>
                          ))}
                      </div>
                    ) : null}
                  </div>
                )}
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
