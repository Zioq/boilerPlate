import React,{useState} from 'react'
import {useDispatch} from 'react-redux';
import {loginUser, registerUser } from "../../../_actions/user_action";
import { Button,Input } from 'antd';


function RegisterPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  };

  const onNameHandler = (e) => {
      setName(e.target.value);
  }

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const onConfrimPasswordHandler = (e) => {
    setConfirmPassword(e.target.value);
  }
  


  const onSubmitHandler = (e) => {
    e.preventDefault();

    if(Password !== ConfirmPassword) {
        return alert("Please check password again");
    }

    let body = {
      email: Email,
      name:Name,
      password: Password,
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        props.history.push("/login");
      } else {
        alert("Failed to sign up");
      }
    });
  };

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
      <form style={{ display: "flex", flexDirection: "column" }} >
        <label>Email</label>
        <Input type="email" value={Email} onChange={onEmailHandler} />

        <label>Name</label>
        <Input type="text" value={Name} onChange={onNameHandler} />

        <label>Password</label>
        <Input type="Password" value={Password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <Input type="Password" value={ConfirmPassword} onChange={onConfrimPasswordHandler} />

        <br />
        <Button onClick={onSubmitHandler}>Register</Button>
      </form>
    </div>
  );
}

export default RegisterPage;
