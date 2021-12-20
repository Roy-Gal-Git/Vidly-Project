import React, { Component } from "react";
import Movies from "./components/movies";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <main className="container mt-4">
        <Movies />
      </main>
    );
  }
}

export default App;
