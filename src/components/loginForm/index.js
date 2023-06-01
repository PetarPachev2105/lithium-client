import React, {Component} from 'react';
import {Button, Intent, FormGroup, InputGroup, Label} from '@blueprintjs/core';
import styles from './loginForm.module.css';
import axios from 'axios';
import errorGif from "../../assets/errorGifs/error2.gif";
import funnyGif from "../../assets/funnyGifs/funny4.gif";
import config from "../../config/index";

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            setToken: this.props.setToken,
            showError: this.props.showError,
        }

        this.state = {
            email: '',
            password: '',
            hasError: false,
        }
    }


    submitForm = async () => {
        try {
            const response = await axios.post(`${config.API_URL}/user/login`, {
                email: this.state.email,
                password: this.state.password,
            });
            this.parentFunctions.setToken(response.data.accessToken, response.data.lithiumHood.id);
        } catch (e) {
            this.setState({
                hasError: true,
            })
            this.parentFunctions.showError(e.response.data.message);
        }
    }

    handleEmailChange = (email) => {
        this.setState({
            email: email
        });
    }

    handlePasswordChange = (password) => {
        this.setState({
            password: password
        });
    }

    render() {
        return (
            <div className={styles.component}>
                <h4>Login</h4>
                <div className={styles.loginForm}>
                    <FormGroup>
                        <Label> Email:
                            <InputGroup
                                value={this.state.email}
                                className={styles.inputField}
                                type={'text'}
                                onChange={(event) => {
                                    const newEmail = event.target.value;
                                    this.handleEmailChange(newEmail);
                                }}
                            />
                        </Label>
                        <Label> Password:
                            <InputGroup
                                value={this.state.password}
                                className={styles.inputField}
                                type={'password'}
                                fill={false}
                                onChange={(event) => {
                                    const newPassword = event.target.value;
                                    this.handlePasswordChange(newPassword);
                                }}
                            />
                        </Label>
                        <Button className={styles.submitButton}
                                icon={'log-in'}
                                intent={Intent.SUCCESS}
                                onClick={this.submitForm}
                                text={'Login'}
                                minimal={false}
                                outlined={false}
                                alignText={'left'}>
                        </Button>
                    </FormGroup>
                </div>
                {this.state.hasError && <img src={errorGif} alt={'Error'} width={'600px'}/>}
                {!this.state.hasError && <img src={funnyGif} alt={'Funny'} width={'600px'}/>}
            </div>
        );
    }
}

export default LoginForm;