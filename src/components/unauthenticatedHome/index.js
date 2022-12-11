import React, {Component} from 'react';
import {Intent, Position, Toast, Toaster} from '@blueprintjs/core';

import LoginForm from "../loginForm";
import SignUpForm from "../signUpForm";
import About from "../about";

import homeStyles from '../../containers/lithiumHood.module.css';
import styles from './unauthenticatedHome.module.css';

class unauthenticatedHome extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            setToken: this.props.setToken,
        }

        this.toaster = Toaster;
        this.refHandlers = {
            toaster: ref => this.toaster = ref,
        };

        this.state = {
            toasts: [],
            showLogin: false,
            showSignUp: false,
            showInfo: true,
        }
    }

    /**
     * Shows an error toast
     */
    showError = (err) => {
        // Extract an error message to show the user
        const errorMessage = err.response && err.response.data && err.response.data.message ? err.response.data.message : err.toString();
        this.toaster.show({
            message: errorMessage,
            icon: 'issue',
            intent: Intent.DANGER,
        });
    }

    showLogin = () => {
        this.setState({
            showLogin: true,
            showSignUp: false,
            showInfo: false,
        });
    }

    showSignUp = () => {
        this.setState({
            showLogin: false,
            showSignUp: true,
            showInfo: false,
        });
    }

    showInfo = () => {
        this.setState({
            showLogin: false,
            showSignUp: false,
            showInfo: true,
        });
    }

    render() {
        return (
            <div className={styles.component}>
                {/* Toast component*/}
                <Toaster position={Position.BOTTOM_RIGHT} ref={this.refHandlers.toaster}>
                    {this.state.toasts.map(toast => <Toast {...toast} />)}
                </Toaster>

                <nav className={homeStyles.navbar}>
                    <div className={homeStyles.trapezoid}>
                        <div className={homeStyles.subnav}>
                            <button onClick={this.showLogin} className={homeStyles.subnavbtn}>
                                Login
                            </button>
                        </div>

                        <div className={homeStyles.subnav}>
                            <button onClick={this.showInfo} className={homeStyles.subnavbtn}>
                                Lithium
                            </button>
                        </div>

                        <div className={homeStyles.subnav}>
                            <button onClick={this.showSignUp} className={homeStyles.subnavbtn}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </nav>


                <h3> Welcome to Lithium </h3>

                {this.state.showLogin &&
                    <LoginForm setToken={this.parentFunctions.setToken} showError={this.showError}/>}

                {this.state.showSignUp &&
                    <SignUpForm setToken={this.parentFunctions.setToken} showError={this.showError}/>}

                {this.state.showInfo && <About/>}
            </div>
        )
    }
}

export default unauthenticatedHome;