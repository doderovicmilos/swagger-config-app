import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {Provider} from 'react-redux';
import './App.css';
import store from "./store";
import Home from './pages/Home/HomePage';
import Config from './pages/Config/ConfigPage';
import SignUpPage from "./pages/SignUp/SignUpPage";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <header className="App-header">
        <Router>
          <Navbar />
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/sign-up'>
              <SignUpPage />
            </Route>
            <Route path='/config/:configName' children={<Config />}/>
          </Switch>
        </Router>
      </header>
    </div>
    </Provider>
  );
}

export default App;
