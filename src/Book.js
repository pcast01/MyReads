import React from "react";
import "./App.css";
import { update } from "./BooksAPI";

let bookTitle = "";
let author = "";
let thumbnail = "";
let shelf = "";

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    // console.log(this.props.book);
  }

  state = {
    shelf: "none"
  };

  componentDidMount() {
    if (this.props.book.shelf) {
      this.setState({ shelf: this.props.book.shelf });
    } else {
      this.setState({ shelf: "none" });
    }
  }

  onChange = e => {
    e.preventDefault();
    // console.log("found dropdown react.");
    // console.log(e.target.value);
    // console.log("shelf: " + shelf);
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
    for (let property in this.props.book) {
      if (property === "title") {
        bookTitle = this.props.book[property];
      } else if (property === "authors") {
        author = this.props.book[property][0];
      } else if (property === "imageLinks") {
        thumbnail = this.props.book[property].smallThumbnail;
      } else if (property === "shelf") {
        shelf = this.props.book[property];
      }
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
          <div className="book-shelf-changer">
            <select
              id="shelfState"
              onChange={this.onChange}
              value={this.state.shelf}
            >
              <option value="none" disabled>
                Move to...
              </option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{bookTitle}</div>
        <div className="book-authors">{author}</div>
      </div>
    );
  }
}

export default Book;
