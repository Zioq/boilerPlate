import React, { useEffect } from "react";
import axios from "axios";
import {Button} from 'antd';
import {withRouter} from 'react-router-dom';

function LandingPage(props) {
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response));
  }, []);

  const logoutHandler = () => {
    axios.get('/api/users/logout')
      .then(response=> {
        console.log(response.data);
        if(response.data.success) {
          props.history.push('/login');
        } else {
          alert("Failed to logout");
        }
        
      })

  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>Landing Page</h2>
      <br />
      <Button onClick={logoutHandler}>
        Logout
      </Button>
    </div>
  );
}

export default withRouter(LandingPage);
