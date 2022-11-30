import React, { Component } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import styles from './account.module.css';

class Account extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            logout: this.props.logout,
        }


        this.state = {
            user: this.props.user,
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={styles.component}>
                <h3>{this.state.user.username}</h3>
                <Button style={{ margin: '20px' }}
                        intent={Intent.DANGER}
                        icon={'log-out'}
                        onClick={this.parentFunctions.logout}
                        text={'Logout'}
                        minimal={false}
                        outlined={false}
                        alignText={'left'}>
                </Button>
            </div>
        )
    }
}

export default Account;