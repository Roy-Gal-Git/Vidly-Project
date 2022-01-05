import React, { Component } from "react";
import * as moviesAPI from "../services/fakeMovieService";
import Like from "./like";
import Pagination from "./pagination";
import { paginate } from "../utils/paginate";

class Movies extends Component {
  state = {
    movies: moviesAPI.getMovies(),
    pageSize: 4,
    currentPage: 1,
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
    this.setState({ currentPage: page });
  };

  getMoviesHtml = (movies) => {
    return movies.map((movie) => {
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
    const { currentPage, pageSize, movies: allMovies } = this.state;

    const movies = paginate(allMovies, currentPage, pageSize);

    return (
      <React.Fragment>
        <div className="mb-3">
          {allMovies.length > 0 ? (
            <React.Fragment>
              <p>Showing {allMovies.length} movies in the database.</p>
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
                <tbody>{this.getMoviesHtml(movies)}</tbody>
              </table>
            </React.Fragment>
          ) : (
            <p>There are no movies in the database.</p>
          )}
        </div>

        <Pagination
          itemsCount={allMovies.length}
          pageSize={pageSize}
          onPageChange={this.handlePageChange}
          currentPage={currentPage}
        />
      </React.Fragment>
    );
  }
}

export default Movies;
