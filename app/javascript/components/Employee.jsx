import React, { Component } from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar";
import Alert from "./Alert";

export default class Employee extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // }

  constructor(props) {
    super(props);

    let userDetail = localStorage.getItem("userDetail");
    userDetail = JSON.parse(userDetail);

    if (!userDetail) this.props.history.push("/");

    this.state = {
      user: userDetail,
      skills: [],
      untracked_skills: [],
      skill_proficiencies: [],
      skill_id: "",
      proficiency: "",
      message: null
    };
    this.onChange = this.onChange.bind(this);
    this.trackSkill = this.trackSkill.bind(this);
    this.fetchUserSkillInfo = this.fetchUserSkillInfo.bind(this);
  }

  componentDidMount() {
    this.fetchUserSkillInfo();
  }

  fetchUserSkillInfo() {
    const url = `/api/v1/user_dashboard_info`;
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
        const { skills, skill_proficiencies, untracked_skills } = response;
        this.setState({
          skills,
          skill_proficiencies: Object.keys(skill_proficiencies),
          untracked_skills
        });
      })
      .catch(error => console.log(error));
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  trackSkill(event) {
    event.preventDefault();

    const { skill_id, proficiency, user } = this.state;

    if (skill_id.length === 0 || proficiency.length === 0) return;

    const url = "/api/v1/track_skill";
    const body = {
      skill: { user_id: user.id, skill_id, proficiency }
    };
    const token = document.querySelector('meta[name="csrf-token"]').content;
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
        const { message } = response;
        if (message) {
          this.setState({ skill_id: "", proficiency: "", message });
          this.fetchUserSkillInfo();
        } else {
          this.setState({ message: "An error occured." });
        }
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <Navbar name={this.state.user.full_name.split(" ")[0]} />
        <div className="container-fluid">
          <div className="row">
            <nav className="col-12 col-lg-2 bg-light sidebar">
              <div className="vh-100">
                <h5 className="sidebar-heading d-flex justify-content-between align-items-center pr-3 mt-4 mb-1 text-muted">
                  Add A New Skill
                </h5>
                <div className="nav flex-column my-4">
                  <form onSubmit={this.trackSkill}>
                    {this.state.untracked_skills.length > 0 ? (
                      <div>
                        <div className="form-group">
                          <label htmlFor="skill_id">Skill</label>
                          <select
                            className="form-control form-control-sm"
                            name="skill_id"
                            id="skill_id"
                            value={this.state.skill_id}
                            onChange={this.onChange}
                            required
                          >
                            <option value="">Select a skill</option>
                            {this.state.untracked_skills.map(skill => (
                              <option key={skill.id} value={skill.id}>
                                {`${skill.name
                                  .charAt(0)
                                  .toUpperCase()}${skill.name.slice(1)}`}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="proficiency">Proficiency level</label>
                          <select
                            className="form-control form-control-sm"
                            name="proficiency"
                            id="proficiency"
                            value={this.state.proficiency}
                            onChange={this.onChange}
                            required
                          >
                            <option value="">Select a proficiency level</option>
                            {this.state.skill_proficiencies.map(
                              (proficiency, index) => (
                                <option key={index} value={proficiency}>
                                  {`${proficiency
                                    .charAt(0)
                                    .toUpperCase()}${proficiency.slice(1)}`}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm"
                        >
                          Submit
                        </button>
                      </div>
                    ) : (
                      "no skill to add"
                    )}
                  </form>
                </div>
              </div>
            </nav>
            <main className="col-12 col-lg-10 bg-white bg-dark">
              <div className="container">
                {this.state.message && <Alert message={this.state.message} />}
                {this.state.skills.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="display-4">Your Skills</h4>
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
                                <td>{`${skill.name
                                  .charAt(0)
                                  .toUpperCase()}${skill.name.slice(1)}`}</td>
                                <td>{skill.desc}</td>
                                <td>{skill.proficiency}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="vh-100 d-flex justify-content-center align-items-center">
                    <h4 className="lead">No have not tracked any skill yet.</h4>
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
