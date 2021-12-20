import React, { Component } from "react";
import * as moviesAPI from "../services/fakeMovieService";

class Movies extends Component {
  state = {
    movies: moviesAPI.getMovies(),
    header: ["Title", "Gebre", "Stock", "Rate", ""],
  };

  renderTableData() {
    return this.state.movies.map((movie, index) => {
      const { _id, title, genre, numberInStock, dailyRentalRate } = movie;
      return (
        <tr key={_id}>
          <td>{title}</td>
          <td>{genre.name}</td>
          <td>{numberInStock}</td>
          <td>{dailyRentalRate}</td>
          <td>
            <button
              onClick={() => this.handleDelete(_id)}
              className="btn-danger btn-sm"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  }

  handleDelete(_id) {
    this.setState({
      movies: this.state.movies.filter((movie) => movie._id !== _id),
    });
  }

  renderTableHeader() {
    return this.state.header.map((key, index) => <th key={index}>{key}</th>);
  }

  render() {
    return (
      <React.Fragment>
        <main className="container mt-4">
          <div className="mb-3">
            {this.state.movies.length > 0
              ? `Showing ${this.state.movies.length} movies in the database.`
              : `There are no movies in the database.`}
          </div>
          <table id="movies" className="table table-hover">
            <tbody>
              <tr>
                {this.state.movies.length > 0 ? this.renderTableHeader() : null}
              </tr>
              {this.renderTableData()}
            </tbody>
          </table>
        </main>
      </React.Fragment>
    );
  }
}

export default Movies;
