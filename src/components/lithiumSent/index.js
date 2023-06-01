import React, { Component } from 'react';
import {v1} from 'uuid';
import {Popover, Icon, FormGroup, Button, Label, InputGroup} from "@blueprintjs/core";
import styles from './lithiumSent.module.css';

class LithiumSent extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {}

        this.state = {
            isOpen: false,
            username: '',
            unseenLithiums: [],
            unseenLithiumsCount: 0,
            sending: false,
        }

        this.virtualLithiumHood = props.virtualLithiumHood;

        this.eventListenerId = v1();
    }

    async componentDidMount() {
        await Notification.requestPermission()

        this.virtualLithiumHood.lithiumHoodFunctions['setCountOfUnseenLithiums'] = this.setCountOfUnseenLithiums;

        await this.virtualLithiumHood.gettingCountOfUnseenLithiums();

        this.virtualLithiumHood.addEventListener(this.virtualLithiumHood.eventList.error, this.eventListenerId, async () => {
            this.sentLithium();
        });
    }

    togglePopOver = async () => {
        if (!this.state.isOpen) {
            this.virtualLithiumHood.lithiumHoodFunctions['setUnseenLithiums'] = this.setUnseenLithiums;
            this.virtualLithiumHood.lithiumHoodFunctions['sentLithium'] = this.sentLithium;
            await this.virtualLithiumHood.gettingUnseenLithiums();
        } else {
            this.virtualLithiumHood.lithiumHoodFunctions['setUnseenLithiums'] = null;
            this.virtualLithiumHood.lithiumHoodFunctions['sentLithium'] = null;
        }
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    setUnseenLithiums = (unseenLithiums) => {
        this.setState({
            unseenLithiums: unseenLithiums,
        });
        const lithiums = unseenLithiums.filter(obj => obj.seen === false);
        if (lithiums.length > 0) {
            this.virtualLithiumHood.seeingAllLithiums();
        }
    }

    changeUsername = (newUsername) => {
        this.setState({
            username: newUsername,
        });
    }

    setCountOfUnseenLithiums = (count) => {
        this.setState({
            unseenLithiumsCount: count,
        })
    }

    sendingLithium = () => {
        this.virtualLithiumHood.sendingLithium(this.state.username);
        this.setState({
            sending: true,
        })
    }

    sentLithium = () => {
        this.setState({
            sending: false,
        });
    }

    componentWillUnmount() {
        this.virtualLithiumHood.removeEventListener(this.eventListenerId);
    }

    render() {

        const popOverContent = <div style={{
            background: '#353839',
            color: '#fff',
        }}>

            <div style={{
                padding: '10px',
                fontSize: '12px',
                maxWidth: '300px',
            }}>
                <div style={{
                    background: '#555555',
                    border: '1px solid #0E0E10',
                    padding: '5px',
                    marginBottom: '10px',
                    borderRadius: '5px',
                    textAlign: 'center',
                }}>
                    You have <strong>{this.state.unseenLithiumsCount}</strong> unseen lits.
                </div>
                {this.state.unseenLithiumsCount > 0 && this.state.unseenLithiums.length > 0 &&
                    <div>
                        {this.state.unseenLithiums.map((unseenLithium) => (
                            <div key={unseenLithium.id}
                                 style={{
                                    background: '#555555',
                                    border: '1px solid #0E0E10',
                                    padding: '5px',
                                    marginBottom: '10px',
                                    borderRadius: '5px',
                                    textAlign: 'center',
                                 }}>
                                <strong>{unseenLithium.user.username}</strong> - {unseenLithium.sent_at} - {unseenLithium.seen ? 'seen' : 'unseen'}
                            </div>
                        ))}
                    </div>}
                <FormGroup>
                    <Label> Username:
                        <InputGroup
                            value={this.state.username}
                            style={{background: '#555555', color: '#fff'}}
                            type={'text'}
                            onChange={(event) => {
                                const username = event.target.value;
                                this.changeUsername(username);
                            }}
                        />
                    </Label>
                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>
                        <Button minimal={false}
                                icon="flame"
                                loading={this.state.sending}
                                disabled={this.state.username.length <= 0}
                                intent={'primary'}
                                text={'Send Lit'}
                                style={{background: '#fee715', color: '#0E0E10'}}
                                onClick={this.sendingLithium}/>
                    </div>
                </FormGroup>
            </div>
        </div>

        return (
            <div className={styles.component}>
                <Popover
                    portalClassName="lithiumSent-popover-portal"
                    isOpen={!!this.state.isOpen}
                    content={popOverContent}
                    style={{background: '#353839', color: '#353839', fill: '#353839'}}
                >
                    <Icon
                        icon={'flame'}
                        iconSize={32}
                        color={'#0E0E10'}
                        style={{ cursor: 'pointer', padding: '10px' }}
                        title={'Your Lithiums'}
                        onClick={this.togglePopOver}/>
                </Popover>
            </div>
        )
    }
}

export default LithiumSent;