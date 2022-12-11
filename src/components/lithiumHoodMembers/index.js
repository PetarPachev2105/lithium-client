import React, { Component } from 'react';
import {Button, Intent, FormGroup, InputGroup, Label} from '@blueprintjs/core';
import {v1} from 'uuid';
import styles from './lithiumHoodMembers.module.css';

class LithiumHoodMembers extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {}

        this.state = {
            working: true,
            lithiumHoodMembers: [],
            lithiumHoodRequests: [],
            username: '',
            sendingRequest: false,
            respondingRequest: false,
            removingFromLithiumHood: false,
        }

        this.eventListenerId = v1();

        this.virtualLithiumHood = this.props.virtualLithiumHood;
    }

    componentDidMount() {
        this.virtualLithiumHood.lithiumHoodFunctions['receivedLithiumHoodMembers'] = this.receivedLithiumHoodMembers;
        this.virtualLithiumHood.lithiumHoodFunctions['receivedLithiumHoodRequests'] = this.receivedLithiumHoodRequests;
        this.virtualLithiumHood.lithiumHoodFunctions['sentLithiumHoodRequest'] = this.sentLithiumHoodRequest;
        this.virtualLithiumHood.lithiumHoodFunctions['acceptedLithiumHoodRequest'] = this.acceptedLithiumHoodRequest;
        this.virtualLithiumHood.lithiumHoodFunctions['declinedLithiumHoodRequest'] = this.declinedLithiumHoodRequest;
        this.virtualLithiumHood.lithiumHoodFunctions['removedLithiumHoodMember'] = this.removedLithiumHoodMember;


        this.gettingLithiumHoodMembers();
        this.gettingLithiumHoodRequests();

        this.virtualLithiumHood.addEventListener(this.virtualLithiumHood.eventList.error, this.eventListenerId, async () => {
            this.setState({
                sendingRequest: false,
                respondingRequest: false,
                removingFromLithiumHood: false,
            });
        });
    }

    componentWillUnmount() {
        this.virtualLithiumHood.lithiumHoodFunctions['receivedLithiumHoodMembers'] = null;
        this.virtualLithiumHood.lithiumHoodFunctions['receivedLithiumHoodRequests'] = null;
        this.virtualLithiumHood.lithiumHoodFunctions['sentLithiumHoodRequest'] = null;
        this.virtualLithiumHood.lithiumHoodFunctions['acceptedLithiumHoodRequest'] = null;
        this.virtualLithiumHood.removeEventListener(this.eventListenerId);
    }

    gettingLithiumHoodMembers = () => {
        this.virtualLithiumHood.gettingLithiumHoodMembers();
    }

    receivedLithiumHoodMembers = (lithiumHoodMembers) => {
        this.setState({
            lithiumHoodMembers: lithiumHoodMembers,
        })
    }

    gettingLithiumHoodRequests = () => {
        this.virtualLithiumHood.gettingLithiumHoodRequests();
    }

    receivedLithiumHoodRequests = (lithiumHoodRequests) => {
        this.setState({
            lithiumHoodRequests: [...this.state.lithiumHoodRequests, ...lithiumHoodRequests],
        })
    }

    handleUsernameChange = (newValue) => {
        this.setState({
            username: newValue,
        })
    }

    sendLithiumHoodRequest = () => {
        this.virtualLithiumHood.sendingLithiumHoodRequest(this.state.username);
        this.setState({
            sendingRequest: true,
        });
    }

    sentLithiumHoodRequest = () => {
        this.setState({
            sendingRequest: false,
        });
    }

    acceptingLithiumHoodRequest = (lithiumHoodRequestId) => {
        this.virtualLithiumHood.acceptingLithiumHoodRequest(lithiumHoodRequestId);
        this.setState({
            respondingRequest: true,
        });
    }

    acceptedLithiumHoodRequest = (newLithiumHoodMember) => {
        const lithiumHoodMembers = this.state.lithiumHoodMembers;
        lithiumHoodMembers.unshift(newLithiumHoodMember);
        this.removeLithiumHoodRequestFromState(newLithiumHoodMember.user.username);
        this.setState({
            lithiumHoodMembers: lithiumHoodMembers,
            respondingRequest: false,
        });
    }

    decliningLithiumHoodRequest = (lithiumHoodRequestId) => {
        this.virtualLithiumHood.decliningLithiumHoodRequest(lithiumHoodRequestId);
        this.setState({
            respondingRequest: true,
        });
    }

    declinedLithiumHoodRequest = (username) => {
        this.setState({
            respondingRequest: false,
        }, () => {
            this.removeLithiumHoodRequestFromState(username);
        });
    }

    removeLithiumHoodRequestFromState = (username) => {
        const lithiumHoodRequests = this.state.lithiumHoodRequests;
        const removedRequestIndex = lithiumHoodRequests.findIndex(lithiumHoodRequest => {
            return lithiumHoodRequest.username === username;
        });

        lithiumHoodRequests.splice(removedRequestIndex, 1);

        this.setState({
            lithiumHoodRequests: lithiumHoodRequests,
        })
    }

    removingLithiumHoodMember = (username) => {
        this.virtualLithiumHood.removingLithiumHoodMember(username);
        this.setState({
            removingFromLithiumHood: true,
        });
    }

    removedLithiumHoodMember = (username) => {
        const newLithiumHoodMembers = this.state.lithiumHoodMembers;
        const removedMemberOfLithiumHoodIndex = newLithiumHoodMembers.findIndex(lithiumHoodMember => {
            return lithiumHoodMember.user.username === username;
        });

        newLithiumHoodMembers.splice(removedMemberOfLithiumHoodIndex, 1);

        this.setState({
            lithiumHoodMembers: newLithiumHoodMembers,
            removingFromLithiumHood: false,
        });
    }

    render() {
        return (
            <div className={styles.component}>
                <div className={styles.sendLithiumHoodRequestForm}>
                    <FormGroup>
                        <Label> Username: </Label>
                        <InputGroup
                            className={styles.inputField}
                            value={this.state.username}
                            fill={false}
                            onChange={(event) => {
                                this.handleUsernameChange(event.target.value);
                            }}
                        />
                        <Button className={styles.submitButton}
                                // icon={'log-in'}
                                onClick={this.sendLithiumHoodRequest}
                                text={'Send Request'}
                                minimal={false}
                                outlined={false}
                                loading={this.state.sendingRequest}
                                alignText={'left'}>
                        </Button>
                    </FormGroup>
                </div>
                {this.state.lithiumHoodRequests.length > 0 && <div>
                    <h3> Pending requests</h3>
                    {this.state.lithiumHoodRequests.map((hoodRequest) => (
                        <div className={styles.notRepliedRequest} key={hoodRequest.id}>
                            <div className={styles.notRepliedRequestInfoContainer}>
                                <div className={styles.notRepliedRequestInfo}>
                                    {hoodRequest.user.username}
                                    <br/>
                                    {hoodRequest.sent_at}
                                </div>
                            </div>
                            <div className={styles.notRepliedRequestActionContainer}>
                                <div className={styles.notRepliedRequestActionAccept}>
                                    <Button className={styles.notRepliedRequestActionButton}
                                            onClick={() => {this.acceptingLithiumHoodRequest(hoodRequest.id)}}
                                            icon={'new-person'}
                                            text={'Accept'}
                                            intent={Intent.SUCCESS}
                                            minimal={false}
                                            outlined={false}
                                            loading={this.state.respondingRequest}
                                            alignText={'right'}>
                                    </Button>
                                </div>
                                <div className={styles.notRepliedRequestActionDecline}>
                                    <Button
                                        className={styles.notRepliedRequestActionButton}
                                        onClick={() => {this.decliningLithiumHoodRequest(hoodRequest.id)}}
                                        icon={'trash'}
                                        text={'Decline'}
                                        intent={Intent.DANGER}
                                        minimal={false}
                                        outlined={false}
                                        loading={this.state.respondingRequest}
                                        alignText={'right'}>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>}
                {this.state.lithiumHoodMembers.length > 0 && <div>
                    <h3>Your hood</h3>
                    {this.state.lithiumHoodMembers.map((hoodMember) => (
                        <div key={hoodMember.id} className={styles.lithiumHoodMember}>
                            <div className={styles.lithiumHoodMemberInfoContainer}>
                                <div className={styles.lithiumHoodMemberInfo}>
                                    <div>{hoodMember.user.username}</div>
                                </div>
                            </div>
                            <div className={styles.lithiumHoodRoleContainer}>
                                <div className={styles.lithiumHoodRole}>
                                    <div>{hoodMember.role}</div>
                                </div>
                            </div>
                            <div className={styles.lithiumHoodRemoveContainer}>
                                <div className={styles.lithiumHoodRemove}>
                                    <Button
                                        className={styles.lithiumHoodRemoveButton}
                                        onClick={() => {this.removingLithiumHoodMember(hoodMember.user.username)}}
                                        icon={'trash'}
                                        text={'Remove'}
                                        intent={Intent.DANGER}
                                        minimal={false}
                                        outlined={false}
                                        loading={this.state.removingFromLithiumHood}
                                        alignText={'right'}>
                                    </Button>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>}
            </div>
        )
    }
}

export default LithiumHoodMembers;