import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Admin from "../components/Admin";
import Employee from "../components/Employee";
import EmployeeSkill from "../components/EmployeeSkill";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/admin" exact component={Admin} />
      <Route path="/employee" exact component={Employee} />
      <Route path="/employee_skill/:id" exact component={EmployeeSkill} />
    </Switch>
  </Router>
);

// if logged in, don't show homepage