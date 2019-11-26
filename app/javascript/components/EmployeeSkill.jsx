import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default class EmployeeSkill extends Component {
  constructor(props) {
    super(props);

    let userDetail = localStorage.getItem("userDetail");
    userDetail = JSON.parse(userDetail);

    if (!userDetail) this.props.history.push("/");
    if (userDetail.role !== "admin") this.props.history.push("/");

    this.state = {
      user: userDetail,
      skills: [],
      employee: {}
    };

    this.fetchSkillInfo = this.fetchSkillInfo.bind(this);

    this.fetchSkillInfo();
  }

  fetchSkillInfo() {
    const id = this.props.match.params.id;

    const url = `/api/v1/user_skill_info/${id}`;
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
        const { skills, user } = response;
        this.setState({ skills: skills, employee: user });
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <Navbar name={this.state.user.full_name} />

        <div className="container mt-4">
          <Link className="btn btn-sm btn-info" to="/admin">
            Back to dashboard
          </Link>
        </div>
        {this.state.skills.length > 0 ? (
          <div className="container-fluid">
            <div className="container mt-4">
              <div className="row">
                <div className="col-12">
                  <h5 className="display-4">{this.state.employee.full_name}</h5>
                  <p className="lead">
                    Total Number of Skills: {this.state.skills.length}
                  </p>
                  <div className="my-4 table-wrapper">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Proficiency</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.skills.map((skill, index) => (
                            <tr key={skill.id}>
                              <th scope="row">{index + 1}</th>
                              <td>{skill.name}</td>
                              <td>{skill.desc}</td>
                              <td>{skill.proficiency}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="vh-100 d-flex justify-content-center align-items-center">
            <h4 className="lead">Employee has no skill</h4>
          </div>
        )}
      </div>
    );
  }
}
