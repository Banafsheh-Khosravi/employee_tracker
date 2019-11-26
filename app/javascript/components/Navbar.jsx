import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  static defaultProps = {
    name: "User"
  };

  logout(event) {
    event.preventDefault();

    const url = "api/v1/users/sign_out";
    const token = document.querySelector('meta[name="csrf-token"]').content;
    const jwtToken = localStorage.getItem("token");

    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      }
    })
      .then(response => {
        if (response.ok) {
          localStorage.removeItem("userDetail");
          localStorage.removeItem("token");
          this.props.history.push("/");
          // window.location.reload();
          // window.location.href = "/";
        }
      })
      .catch(error => console.log(error.message));
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg_secondary-color">
        <Link className="navbar-brand" to="/">
          Employee Tracker
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <span className="navbar-text text-white mr-4">{`Welcome ${this.props.name}`}</span>
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
              onClick={this.logout}
            >
              Sign Out
            </button>
          </form>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);
