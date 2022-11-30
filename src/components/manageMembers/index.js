import React, {Component} from 'react';
import {Classes, Dialog} from '@blueprintjs/core';
import axios from "axios";
import {v1} from 'uuid';
import styles from './manageMembers.module.css';

class ManageMembersMenu extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            closeManageMembersMenu: this.props.closeManageMembersMenu,
            closeSettingsDialog: this.props.closeSettingsDialog,
        }

        this.virtualLithiumRoom = this.props.virtualLithiumRoom;

        this.state = {
            isOpened: false,
            members: [],
        }

        this.eventListenerId = v1();
    }

    getMembers = async () => {
        const response = await axios.get(`http://localhost:5000/api/chatRoom/${this.virtualLithiumRoom.lithiumRoomId}/get_members`, {
            headers: {
                Token: this.virtualLithiumRoom.token,
                ClientId: this.virtualLithiumRoom.clientId,
            },
        });
        const members = response.data.map(member => member.user);

        const membersExceptCurrentUser = [];
        members.forEach((member) => {
            if (member.username !== this.virtualLithiumRoom.username) {
                membersExceptCurrentUser.push(member);
            }
        });

        this.setState({
            isOpened: true,
            members: membersExceptCurrentUser,
        });
    }

    async componentDidMount() {
        await this.getMembers();
        this.virtualLithiumRoom.addEventListener(this.virtualLithiumRoom.eventList.removedMember, this.eventListenerId, async (eventPayload) => {
            await this.getMembers();
        });
    }

    componentWillUnmount() {
        this.virtualLithiumRoom.removeEventListener(this.eventListenerId);
    }

    removeUser = (username) => {
        this.virtualLithiumRoom.removeMember(username);
    }

    render() {
        return (
            <div>
                <Dialog
                    className={styles.dialog}
                    isOpen={this.state.isOpened}
                    onClose={this.parentFunctions.closeManageMembersMenu}
                    icon="new-layer"
                    title="Manage Members"
                    style={{width: '700px'}}
                >
                    <div className={Classes.DIALOG_BODY}>
                        {this.state.members.length === 0 && <div>No other members</div>}
                        {this.state.members.length > 0 && <div className={styles.usersContainer}>
                            {this.state.members.map((member) => (
                                <div className={styles.userContainer} key={member.username}>
                                    <div className={styles.userContainerUsernameContainer}>
                                        <div className={styles.userContainerUsername}>{member.username}</div>
                                    </div>
                                    <div className={styles.userContainerRemove}>
                                        <button
                                            className={styles.userContainerRemoveButton}
                                            onClick={() => {
                                                this.removeUser(member.username)
                                            }}
                                        > Kick
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>}
                    </div>
                </Dialog>

            </div>
        )
    }
}

export default ManageMembersMenu;