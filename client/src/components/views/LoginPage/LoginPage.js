import React,{useState} from 'react'
import {useDispatch} from 'react-redux';
import {loginUser} from "../../../_actions/user_action";
import { Button,Input, Form} from 'antd';
import {withRouter} from 'react-router-dom';

function LoginPage(props) {

    const dispatch = useDispatch();

    const [Email,setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (e) => {
        setEmail(e.target.value);
    }
    const onPasswordHandler = (e) => {
        setPassword(e.target.value);
    }
    const onSubmitHandler = (e) =>{
        console.log("Check");
        
        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response=> {
                if(response.payload.loginSuccess) {
                    props.history.push('/')
                } else {
                    alert('Error');
                }
            })
    }

    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
   
        <Form style={{display:'flex', flexDirection:'column'}}
        >
            <label>Email</label>
            <Input type="email" value={Email} onChange={onEmailHandler} />

            <label>Password</label>
            <Input type="Password" value={Password} onChange={onPasswordHandler} />

            <br />
            <Button  onClick={onSubmitHandler}> 
                Login
            </Button>
        </Form>
        </div>
    )
}

export default withRouter(LoginPage)
