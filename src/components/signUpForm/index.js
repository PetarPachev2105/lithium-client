import React, {Component} from 'react';
import {Button, Intent, FormGroup, InputGroup, Label} from '@blueprintjs/core';
import styles from './signUpForm.module.css';
import axios from 'axios';
import errorGif from '../../assets/errorGifs/error1.gif';
import funnyGif from '../../assets/funnyGifs/funny1.gif';

class SignUpForm extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            setToken: this.props.setToken,
            showError: this.props.showError,
        }

        this.state = {
            email: '',
            password: '',
            password2: '',
            username: '',
            hasError: false,
        }
    }

    handleEmailChange = (email) => {
        this.setState({
            email: email,
            error: false,
        });
    }

    handleUsernameChange = (username) => {
        this.setState({
            username: username,
            error: false,
        });
    }

    handlePasswordChange = (password) => {
        this.setState({
            password: password
        });
    }


    handlePassword2Change = (password2) => {
        this.setState({
            password2: password2
        });
    }

    checkIfFormIsReadyToSubmit = () => {
        return this.state.email.length >= 5 && this.state.username.length >= 5 && this.state.password.length >= 5 && this.state.password === this.state.password2;
    }

    submitForm = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/user/register', {
                email: this.state.email,
                password: this.state.password,
                username: this.state.username,
            });
            this.parentFunctions.setToken(response.data.accessToken);
        } catch (e) {
            this.parentFunctions.showError(e.response.data.message);
            this.setState({
                hasError: true,
            });
        }
    }

    render() {
        return (
            <div className={styles.component}>
                <h4>Sign Up</h4>
                <div className={styles.signUpForm}>
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
                        <Label> Username:
                            <InputGroup
                                value={this.state.username}
                                className={styles.inputField}
                                type={'text'}
                                onChange={(event) => {
                                    const newUsername = event.target.value;
                                    this.handleUsernameChange(newUsername);
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
                        <Label> Confirm your password:
                            <InputGroup
                                value={this.state.password2}
                                className={styles.inputField}
                                type={'password'}
                                fill={false}
                                onChange={(event) => {
                                    const newPassword2 = event.target.value;
                                    this.handlePassword2Change(newPassword2);
                                }}
                            />
                        </Label>
                        <Button className={styles.submitButton}
                                intent={Intent.SUCCESS}
                                icon={'new-person'}
                                disabled={!this.checkIfFormIsReadyToSubmit()}
                                onClick={this.submitForm}
                                text={'Sign Up'}
                                minimal={false}
                                outlined={false}
                                alignText={'left'}>
                        </Button>
                    </FormGroup>
                </div>
                {this.state.hasError && <img src={errorGif} alt={'Error'}/>}
                {!this.state.hasError && <img src={funnyGif} alt={'Funny'}/>}
            </div>
        );
    }
}

export default SignUpForm;