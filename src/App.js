import React, { Component } from 'react';
import UnauthenticatedHome from "./components/unauthenticatedHome";
import LithiumHood from './containers/lithiumHood';
import './App.css';
import axios from "axios";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import LithiumRoom from "./containers/lithiumRoom";
import config from './config';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: !!localStorage.getItem('token'),
            lithiumHoodId: false,
        }
    }

    async componentDidMount() {
        // Initial check if user is logged in if yes then get the user
        if (this.state.isLoggedIn) {
            await this.checkToken();
        }
    }

    /**
     * Save token to the local storage and save lithiumSpaceId
     * @param token
     * @param lithiumHoodId
     */
    setToken = (token, lithiumHoodId) => {
        localStorage.setItem('token', token);
        this.setState({
            lithiumSpaceId: lithiumHoodId,
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
            lithiumHoodId: false,
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
            await axios.post(`${config.API_URL}/session/check_token`, {}, {
                headers: {
                    Token: localStorage.getItem('token'),
                },
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
                        <Route path="/lithiumHood/:lithiumHoodId" component={LithiumHood} />
                        <Route path="/lithiumRoom/:lithiumRoomId" component={LithiumRoom}/>
                        <Route render={() => {
                            window.location.href = `/lithiumHood/${this.state.lithiumHoodId}`;
                        }}/>
                    </Switch>
                </div>
            </Router>

        const unAuthenticatedRoutes =
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" render={() =>
                            <UnauthenticatedHome setToken={this.setToken}/>
                        }/>
                        <Route render={() => {
                            window.location.href = '/';
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
