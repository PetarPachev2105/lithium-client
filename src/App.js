import React, {Component, Fragment} from 'react';
import UnauthenticatedHome from "./components/unauthenticatedHome";
import Home from './containers/home';
import './App.css';
import axios from "axios";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import LithiumRoom from "./containers/lithiumRoom";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: !!localStorage.getItem('token'),
            user: false,
        }
    }

    async componentDidMount() {
        // Initial check if user is logged in if yes then get the user
        if (this.state.isLoggedIn) {
            await this.checkToken();
        }
    }

    /**
     * Save token to the local storage
     * @param token
     */
    setToken = (token) => {
        localStorage.setItem('token', token);
        this.setState({
            isLoggedIn: true,
        }, async () => {
            await this.checkToken();
        })
    }

    /**
     * Logout by just removing the token
     */
    logout = () => {
        localStorage.removeItem('token');
        this.setState({
            user: false,
            isLoggedIn: false,
        }, () => {
            window.location.href = '/';
        });
    }

    /**
     * Check if token is still valid
     * @returns {Promise<void>}
     */
    checkToken = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/session/check_token', {}, {
                headers: {
                    Token: localStorage.getItem('token'),
                },
            });
            const user = response.data.user;
            this.setState({
                user: user,
            });
        } catch (err) {
            this.logout();
        }
    }

    render() {
        const authenticatedRoutes =
            <Router>
                <div>
                    <Switch>
                        <Route path="/lithiumRoom/:lithiumRoomId" component={LithiumRoom}/>
                        <Route path="/home" render={() =>
                            <Home logout={this.logout} user={this.state.user}/>
                        }/>
                        <Route render={() => {
                            window.location.href = '/home';
                        }}/>
                    </Switch>
                </div>
            </Router>

        const unAuthenticatedRoutes =
            <Router>
                <div>
                    <Switch>
                        <Route path="/" render={() =>
                            <UnauthenticatedHome setToken={this.setToken}/>
                        }/>
                        <Route render={() => {
                            window.location.href = '/home';
                        }}/>
                    </Switch>
                </div>
            </Router>

        return (
            <div className='page'>
                {!this.state.isLoggedIn && unAuthenticatedRoutes}
                {this.state.isLoggedIn && authenticatedRoutes}
            </div>
        );
    }
}

export default App;
