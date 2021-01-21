import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import Home from "./Home"
import Watch from "./Watch"

export default function BasicExample() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/watch/:id" component={Watch} />
        </Switch>
      </div>
    </Router>
  );
}
