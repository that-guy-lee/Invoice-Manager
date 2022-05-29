
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/landing'
import Create from './components/create'
import Find from './components/find'



function App() {

  return (

    <Router>
      <div id='container'>
        <Switch>

          <Route path="/create">
            <Create />
          </Route>

          <Route path="/find">
            <Find />
          </Route>

          <Route path="/">
            <Landing />
          </Route>

        </Switch>
      </div>
    </Router>
  )

}

export default App;
