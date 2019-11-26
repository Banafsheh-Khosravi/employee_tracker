import React, { Component } from "react";
import Navbar from "./Navbar";
import Alert from "./Alert";
import { Link } from "react-router-dom";

export default class Admin extends Component {
  constructor(props) {
    super(props);

    let userDetail = localStorage.getItem("userDetail");
    userDetail = JSON.parse(userDetail);

    if (!userDetail) this.props.history.push("/");

    this.state = {
      user: userDetail,
      full_name: "",
      email: "",
      skill: "",
      desc: "",
      message: null,
      employees: [],
      skillCount: null,
      filterTerm: "all"
    };

    this.onChange = this.onChange.bind(this);
    this.addEmployee = this.addEmployee.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.fetchEmployees = this.fetchEmployees.bind(this);
    this.filterEmployees = this.filterEmployees.bind(this);
  }

  componentDidMount() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    const url = "/api/v1/employees";
    const token = document.querySelector('meta[name="csrf-token"]').content;
    const jwtToken = localStorage.getItem("token");

    fetch(url, {
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      }
    })
      .then(response => response.json())
      .then(response => {
        const { employees, skill_count } = response;

        this.setState({ employees, skillCount: skill_count });
      })
      .catch(error => console.log(error.message));
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  addEmployee(event) {
    event.preventDefault();

    const url = "/api/v1/create_employee";
    const { full_name, email } = this.state;

    if (email.length === 0 || full_name.length === 0) return;

    const token = document.querySelector('meta[name="csrf-token"]').content;
    const body = {
      user: { full_name: full_name.trim(), email: email.trim().toLowerCase() }
    };
    const jwtToken = localStorage.getItem("token");

    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(response => {
        const { errors } = response;
        if (errors) {
          let errorString = "";
          for (const key in errors) {
            errorString += `${key} ${errors[key][0]}, `;
            this.setState({ message: errorString });
          }
        } else {
          const successMessage = "Employee has been created";
          this.setState({ message: successMessage, full_name: "", email: "" });
          this.fetchEmployees();
        }
      })
      .catch(error => console.log(error.message));
  }

  addSkill(event) {
    event.preventDefault();

    const url = "/api/v1/skill";
    const { skill, desc } = this.state;

    if (desc.length === 0 || skill.length === 0) return;

    const token = document.querySelector('meta[name="csrf-token"]').content;
    const body = {
      skill: {
        name: skill.trim().toLowerCase(),
        desc: desc.trim().toLowerCase()
      }
    };
    const jwtToken = localStorage.getItem("token");

    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(response => {
        const { errors } = response;
        if (errors) {
          let errorString = "";
          for (const key in errors) {
            errorString += `${key} ${errors[key][0]}, `;
            this.setState({ message: errorString });
          }
        } else {
          const successMessage = "Skill has been added!";
          this.setState({ message: successMessage, skill: "", desc: "" });
          this.fetchEmployees();
        }
      })
      .catch(error => console.log(error.message));
  }

  filterEmployees(event) {
    event.preventDefault();

    const { filterTerm } = this.state;

    const url = `/api/v1/employees?q=${filterTerm}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;
    const jwtToken = localStorage.getItem("token");

    fetch(url, {
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      }
    })
      .then(response => response.json())
      .then(response => {
        const { employees, skill_count } = response;

        this.setState({ employees, skillCount: skill_count });
      })
      .catch(error => console.log(error.message));
  }

  render() {
    return (
      <div>
        <Navbar name={this.state.user.full_name} />
        <div className="container-fluid">
          <div className="row">
            <nav className="col-12 col-lg-2 bg-light sidebar">
              <div className="vh-100">
                <h5 className="sidebar-heading d-flex justify-content-between align-items-center pr-3 mt-4 mb-1 text-muted">
                  Add New Employee
                </h5>
                <div className="nav flex-column my-4">
                  <form onSubmit={this.addEmployee}>
                    <div className="form-group">
                      <label htmlFor="full_name">Full name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="full_name"
                        name="full_name"
                        value={this.state.full_name}
                        placeholder="Enter full name"
                        required
                        onChange={this.onChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email address</label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        id="email"
                        name="email"
                        value={this.state.email}
                        placeholder="Enter email"
                        required
                        onChange={this.onChange}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Submit
                    </button>
                  </form>
                </div>
                <hr className="my-4 bg_secondary-color" />
                {/* skill section */}
                <h5 className="sidebar-heading d-flex justify-content-between align-items-center pr-3 mt-4 mb-1 text-muted">
                  Add New Skill
                </h5>
                <div className="nav flex-column my-4">
                  <form onSubmit={this.addSkill}>
                    <div className="form-group">
                      <label htmlFor="skill">Skill</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="skill"
                        name="skill"
                        value={this.state.skill}
                        placeholder="Enter skill name"
                        required
                        onChange={this.onChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="desc">Skill Description</label>
                      <textarea
                        name="desc"
                        id="desc"
                        cols="18"
                        rows="3"
                        placeholder="Enter skill description"
                        value={this.state.desc}
                        onChange={this.onChange}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </nav>
            <main className="col-12 col-lg-10 bg-white bg-dark">
              <div className="container">
                <div className="col-lg-12">
                  {this.state.message && <Alert message={this.state.message} />}
                </div>
                <div className="row">
                  <div className="container col-12">
                    <div className="py-2 float-right">
                      <form
                        className="form-inline"
                        onSubmit={this.filterEmployees}
                      >
                        <div className="form-group">
                          <label htmlFor="search">
                            Sort employee by proficiency
                          </label>
                          <select
                            className="mx-2"
                            value={this.state.filterTerm}
                            name="filterTerm"
                            onChange={this.onChange}
                          >
                            <option value="all">All</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advance">Advance</option>
                            <option value="master">Master</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm mr-1"
                        >
                          Filter
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                {this.state.employees.length > 0 ? (
                  <div className="mt-4 container-fluid">
                    <h4 className="display-4">Employee Skill Record</h4>
                    <p className="lead">
                      Total Number of Employees: {this.state.employees.length}
                    </p>
                    <p className="lead">
                      Total Number of Skills: {this.state.skillCount}
                    </p>
                    <div className="my-4 table-wrapper">
                      {/* <div className="py-2 float-right">
                        <form
                          className="form-inline"
                          onSubmit={this.filterEmployees}
                        >
                          <div className="form-group">
                            <label htmlFor="search">
                              Sort employee by proficiency
                            </label>
                            <select
                              className="mx-2"
                              value={this.state.filterTerm}
                              name="filterTerm"
                              onChange={this.onChange}
                            >
                              <option value="all">All</option>
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advance">Advance</option>
                              <option value="master">Master</option>
                            </select>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary btn-sm mr-1"
                          >
                            Filter
                          </button>
                        </form>
                      </div> */}
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Name</th>
                              <th scope="col">Email</th>
                              <th scope="col">View Skills</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.employees.map((employee, index) => (
                              <tr key={employee.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{employee.full_name}</td>
                                <td>{employee.email}</td>
                                <td>
                                  <Link
                                    type="button"
                                    className="btn btn-sm"
                                    to={`/employee_skill/${employee.id}`}
                                  >
                                    <ion-icon name="ios-eye"></ion-icon>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="vh-100 d-flex justify-content-center align-items-center">
                    <h4 className="lead">No employees exist</h4>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}
