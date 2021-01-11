import React,{useEffect} from 'react';
import {useDispatch} from "react-redux";
import {auth} from "../_actions/user_action";
export default function (SpecificComponent, option, adminRoute=null) {

    // option === null -> All access allowed
    // option === true -> only login user access allowed
    // option === false -> login user access does not allowed

    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(()=> {
            dispatch(auth()).then(response=>{
                //console.log(response);
                //Not log in status
                if(!response.payload.isAuth) {
                    if(option) {
                        props.history.push("/login");
                    }
                }else {
                    //Login status but no admin status
                    if(adminRoute && !response.payload.isAdmin) {
                        props.history.push("/")
                    } else {
                        if(option === false) {
                            props.history.push("/")
                        }
                    }
                }
            })
        },[])

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}