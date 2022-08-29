import Home from './Home';
import Viewsecret from './Viewsecret'
import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {



  return (
    <Router>
      <div className="App">
        <Navbar />


        <Switch>
          <Route className="navhome" exact path="/">
            <div className="content">
              <Home />
            </div>
          </Route>
          <Route path="/viewsecret">
            <div className="content">
              <Viewsecret />
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;