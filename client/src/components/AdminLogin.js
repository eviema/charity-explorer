import React, { Component } from "react";
import { Button } from 'mdbreact';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

class AdminLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoggedIn: false,
            value: '',
            loginClicked: false,
        }
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleOnClickToLogin = this.handleOnClickToLogin.bind(this);
    }

    handleChangeUsername(event) {
        this.setState({
            entered: true,
            username: event.target.value
        });
    }

    handleChangePassword(event) {
        this.setState({
            entered: true,
            password: event.target.value
        });
    }

    handleOnClickToLogin = () => {
        this.setState({
            loginClicked: true
        });
    }

    render() {

        if (this.state.loginClicked && this.state.username === 'ace' && this.state.password === 'ace') {
            return <Redirect push to="/home" />;
        }
        if (this.state.loginClicked && (this.state.username !== 'ace' || this.state.password !== 'ace')) {
            alert('Oops. Username or password incorrect. Please try again.');
            this.setState({
                loginClicked: false
            });
        }

        var loginPageStyle = {
            backgroundImage: "url(https://images.unsplash.com/photo-1513477967668-2aaf11838bd6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3e76c5cb26d8a1f05333e3b536e71e25&auto=format&fit=crop&w=634&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
        }
    
        var loginBoxStyle = {
            backgroundColor: "#ECEFF1",
            background: "rgba(236, 239, 241, 0.8)",
            padding: "2rem",
        }

        return(
            <div className="row d-flex flex-column align-items-center justify-content-center" style={loginPageStyle}>
                <form className="col-8 col-sm-8 col-md-6 col-lg-5 col-xl-5 text-center" 
                    style={loginBoxStyle} >
                    <h2 className="my-2 pb-3">Welcome to DonateNow</h2>
                    <label>
                        Enter admin username: 
                        <input type="text" name="username" onChange={this.handleChangeUsername} className="mx-2"
                            />
                    </label>
                    <p></p>
                    <label>
                        Enter admin password:
                        <input type="password" name="password" onChange={this.handleChangePassword} className="mx-2"
                            />
                    </label>                    
                    <p></p>
                    <Button className="mt-5" onClick={this.handleOnClickToLogin}>
                        Login
                    </Button>
                    
                </form>
            </div>
        );

    }
    
};

export default AdminLogin;