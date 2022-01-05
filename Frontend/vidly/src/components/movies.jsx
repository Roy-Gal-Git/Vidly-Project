import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import Like from "./like";
import Pagination from "./pagination";
import ListGroup from "./listGroup";
import { paginate } from "../utils/paginate";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
  };

  componentDidMount() {
    const genres = [{ name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }

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

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, currentPage: 1});
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
    const {
      currentPage,
      pageSize,
      selectedGenre,
      movies: allMovies,
    } = this.state;

    const filtered =
      selectedGenre && selectedGenre._id
        ? allMovies.filter((m) => m.genre._id === selectedGenre._id)
        : allMovies;

    const movies = paginate(filtered, currentPage, pageSize);

    if (allMovies.length === 0)
      return <p>There are no movies in the database.</p>;

    return (
      <div className="row">
        <div className="div col-lg-2">
          <ListGroup
            items={this.state.genres}
            onItemSelect={this.handleGenreSelect}
            selectedItem={this.state.selectedGenre}
          />
        </div>
        <div className="div col">
          <div className="mb-3">
            <p>Showing {filtered.length} movies in the database.</p>
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
          </div>
          <Pagination
            itemsCount={filtered.length}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
