import React, {useState, useEffect} from 'react';
import { Route, Redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';

export default function PrivateRoute({ children, ...rest }) {
  const [cookies] = useCookies();
  const [fakeAuth, setFakeAuth] = useState(false);
  const user_info = JSON.parse(localStorage.getItem('user_info'));

  useEffect(()=>{
    if (!cookies.user_token || !user_info){
      // console.log('privateRoute: no user_token or user_info');
      setFakeAuth(true);
    } else {
      // console.log('privateRoute: has user_token and user_info');
      setFakeAuth(false,);
    }
    // console.log('privateRoute after set fakeAuth, it is: ', fakeAuth);
  }, [cookies.user_token, fakeAuth, user_info]);

  return(
    <Route
      {...rest}
      render={() =>
        fakeAuth ? (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}