import React, { Component } from "react";
import * as moviesAPI from "../services/fakeMovieService";
import Like from "./like";
import Pagination from "./pagination";

class Movies extends Component {
  state = {
    movies: moviesAPI.getMovies(),
    pageSize: 10,
  };

  handleDelete(_id) {
    this.setState({
      movies: this.state.movies.filter((movie) => movie._id !== _id),
    });
  }

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;

    this.setState({ movies });
  };

  handlePageChange = (page) => {
    console.log(page);
  };

  getMoviesHtml = () => {
    return this.state.movies.map((movie) => {
      const { _id, title, genre, numberInStock, dailyRentalRate, liked } =
        movie;
      return (
        <tr key={_id}>
          <td>{title}</td>
          <td>{genre.name}</td>
          <td>{numberInStock}</td>
          <td>{dailyRentalRate}</td>
          <td>
            <Like liked={liked} onClick={() => this.handleLike(movie)} />
          </td>
          <td>
            <button
              onClick={() => this.handleDelete(_id)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="mb-3">
          {this.state.movies.length > 0 ? (
            <p>Showing {this.state.movies.length} movies in the database.</p>
          ) : (
            <p>There are no movies in the database.</p>
          )}
        </div>
        <table id="movies" className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Stock</th>
              <th>Rate</th>
              <th>Liked</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{this.getMoviesHtml()}</tbody>
        </table>
        <Pagination
          itemsCount={this.state.movies.length}
          pageSize={this.state.pageSize}
          onPageChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  }
}

export default Movies;
