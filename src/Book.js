import React from "react";
import PropTypes from "prop-types";
import "./App.css";
import { update } from "./BooksAPI";
import "../node_modules/font-awesome/css/font-awesome.min.css";

let bookTitle = "";
let author = "";
let thumbnail = "";
let BookOptions = "";

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  state = {
    shelf: "none"
  };

  componentDidMount() {
    if (this.props.book.shelf) {
      this.setState({ shelf: this.props.book.shelf });
      return;
    }

    // Save book's shelf, if none then save 'none'.
    if (this.props.shelf) {
      this.setState({ shelf: this.props.shelf });
    } else {
      this.setState({ shelf: "none" });
    }
  }

  onChange = e => {
    e.preventDefault();

    // Update Book's Shelf on value change.
    const promiseUpdate = update(this.props.book, e.target.value);
    promiseUpdate.then(result => {
      if (this.props.isSearch) {
        this.props.refresh(true);
      } else {
        this.props.refresh(false);
      }
    });
  };

  render() {
    // Retrieve values for book render
    for (let property in this.props.book) {
      if (property === "title") {
        bookTitle = this.props.book[property];
      } else if (property === "authors") {
        author = this.props.book[property][0];
      } else if (property === "imageLinks") {
        thumbnail = this.props.book[property].thumbnail;
      }
    }

    // Create Select dropdown with selected Shelf
    if (this.state.shelf === "currentlyReading") {
      BookOptions = (
        <select
          id="shelfState"
          onChange={this.onChange}
          value={this.state.shelf}
          style={{ fontFamily: "FontAwesome" }}
        >
          <option value="none" disabled>
            Move to...
          </option>
          <option value="currentlyReading">&#xf14a; Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="none">None</option>
        </select>
      );
    } else if (this.state.shelf === "wantToRead") {
      BookOptions = (
        <select
          id="shelfState"
          onChange={this.onChange}
          value={this.state.shelf}
          style={{ fontFamily: "FontAwesome" }}
        >
          <option value="none" disabled>
            Move to...
          </option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">&#xf14a; Want to Read</option>
          <option value="read">Read</option>
          <option value="none">None</option>
        </select>
      );
    } else if (this.state.shelf === "read") {
      BookOptions = (
        <select
          id="shelfState"
          onChange={this.onChange}
          value={this.state.shelf}
          style={{ fontFamily: "FontAwesome" }}
        >
          <option value="none" disabled>
            Move to...
          </option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">&#xf14a; Read</option>
          <option value="none">None</option>
        </select>
      );
    } else {
      BookOptions = (
        <select
          id="shelfState"
          onChange={this.onChange}
          value={this.state.shelf}
          style={{ fontFamily: "FontAwesome" }}
        >
          <option value="none" disabled>
            Move to...
          </option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="none">&#xf14a; None</option>
        </select>
      );
    }

    return (
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 193,
              backgroundImage: "url(" + thumbnail + ")"
            }}
          />
          <div className="book-shelf-changer">{BookOptions}</div>
        </div>
        <div className="book-title">{bookTitle}</div>
        <div className="book-authors">{author}</div>
      </div>
    );
  }
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  isSearch: PropTypes.bool,
  shelf: PropTypes.string
};

export default Book;
