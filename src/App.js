import React, {useEffect, useState, useContext} from 'react';
// import logo from './logo.svg';
import './App.scss';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Login from './Views/Login/Login';
import MyProfile from './Views/MyProfile/MyProfile';
import Home from './Views/Home/Home';
import Error from './Views/Error/Error';
import Land from './Views/Land/Land';
import Projects from './Views/Projects/Projects';
import Company from './Views/Company/Company';
import PrivateRoute from './Components/PrivateRoute';
import LeftNav from './Components/LeftNav/LeftNav';
import { AppContext } from './Util/Store';
import { useCookies } from 'react-cookie';
import Loading from './Components/Loading/Loading';
import { GetMenu } from './Views/Login/LoginService';
import CompanyDetail from './Views/Company/CompanyDetails';
import Users from './Views/Users/Users';
import Task from './Views/Task/Task';
import TaskDetail from './Views/TaskDetail/TaskDetail';
import MyTaskList from './Views/MyTaskList/MyTaskList';
import TaskHaveWorked from './Views/TaskHaveWorked/TaskHaveWorked';
import TimeRecorder from './Views/TimeRecorder/TimeRecorder';

function App(props) {
  const [showNav, setShowNav] = useState(false);
  const { appState, setAppState } = useContext(AppContext);
  const [cookies] = useCookies();
  const [showLoading, setShowLoading] = useState(false);
  const user_info = JSON.parse(localStorage.getItem('user_info'));
  
  async function getNav(){
    setShowLoading(true);
    await GetMenu(cookies.user_token).then((results)=>{
      if (results.code === 200){
        if (user_info.role_name !== 'admin'){
          results.result.forEach(element => {
            if (element.label_en_US === 'Settings'){
              element.items.forEach(el => {
                if (el.label_en_US === 'Company'){
                  el.path = '/company/details/';
                }
              });
            }
          });
        }
        setShowLoading(false);
        setAppState({
          left_nav: results.result
        });
      } else {
        setShowLoading(false);
        console.log('can not get response');
      }
    }).catch((error) => {
      setShowLoading(false);
      return error;
    });
  }

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (performance.navigation.type === 1 || performance.navigation.type === 0 || !appState.left_nav) {
        showNavHandler();
        getNav();
      }
    }
    window.addEventListener('hashchange', () => {
      showNavHandler();
    });
    return () => {
      mounted = false;
    };
  },[showNav]);
  
  const showNavHandler = () => {
    if (window.location.hash.split('/')[1] === '' || window.location.hash.split('/')[1] === 'login'){
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }

  return (
    <>
      <Router>
        <div className="content-main">
          {showLoading ? <Loading /> : '' }
          {showNav && appState.left_nav.length > 0 ? <LeftNav items={appState.left_nav} /> : ''}
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/home">
              <Home />
            </PrivateRoute>
            <PrivateRoute path="/land">{/* usless */}
              <Land />
            </PrivateRoute>
            <PrivateRoute exact path="/profile/">
              <MyProfile />
            </PrivateRoute>
            <PrivateRoute exact  path="/projects/">
              <Projects />
            </PrivateRoute>
            <PrivateRoute exact path="/company/">
              <Company />
            </PrivateRoute>
            <PrivateRoute path="/company/details/">
              <CompanyDetail />
            </PrivateRoute>
            <PrivateRoute path="/users">
              <Users />
            </PrivateRoute>
            <PrivateRoute exact path="/task/details/:id">
              <TaskDetail />
            </PrivateRoute>
            <PrivateRoute exact path="/tasks/myTaskList">
              <MyTaskList />
            </PrivateRoute>
            <PrivateRoute exact path="/tasks/taskHaveWorked">
              <TaskHaveWorked />
            </PrivateRoute>
            <PrivateRoute exact path="/tasks/TimeRecorder">
              <TimeRecorder />
            </PrivateRoute>
            <PrivateRoute exact path="/tasks/:id">
              <Task />
            </PrivateRoute>
            <Route component={Error} /> 
          </Switch>
        </div>
     </Router>
    </>
  );
}

export default App;
