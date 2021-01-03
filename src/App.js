import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {Provider} from 'react-redux';
import logo from './logo.svg';
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
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        {/*<p>*/}
        {/*  Edit <code>src/App.js</code> and save to reload.*/}
        {/*</p>*/}
        {/*<a*/}
        {/*  className="App-link"*/}
        {/*  href="https://reactjs.org"*/}
        {/*  target="_blank"*/}
        {/*  rel="noopener noreferrer"*/}
        {/*>*/}
        {/*  Learn React*/}
        {/*</a>*/}

        <Router>
          <Navbar/>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/sign-up'>
              <SignUpPage />
            </Route>
            <Route path='/config/:configName' children={<Config />}/>
            {/*<Route path='/person/:id' children={<Person />}></Route>*/}
            {/*<Route path='*'>*/}
            {/*  <Error />*/}
            {/*</Route>*/}
          </Switch>
        </Router>



      </header>
    </div>
    </Provider>
  );
}

export default App;
