import React, {Component} from 'react';
import {
    Classes,
    Dialog,
    FormGroup,
    InputGroup,
    Label,
    Drawer,
    Toaster,
    Intent,
    Position,
    Toast
} from '@blueprintjs/core';
import {v1} from 'uuid';
import styles from './lithiumHood.module.css';
import Account from '../components/account';
import LithiumHoodMembers from '../components/lithiumHoodMembers';
import VirtualLithiumHood from '../models/virtualLithiumHood';
import LoadingAnimation from '../components/loadingAnimation';

class LithiumHood extends Component {
    constructor(props) {
        super(props);

        this.token = localStorage.getItem('token');
        this.clientId = v1();

        this.lithiumHoodId = this.props.match.params.lithiumHoodId;

        this.state = {
            isInitialLoadingDone: false,
            toasts: [],
            lithiumHood: false,
            user: '',
            lithiumRooms: [],
            newLithiumRoomName: '',
            isNewLithiumRoomDialogOpened: false,
            isAccountDrawerOpened: false,
            isLithiumHoodMembersDrawerOpened: false,
            working: false,
        }

        this.virtualLithiumHood = null;

        this.toaster = Toaster;
        this.refHandlers = {
            toaster: ref => this.toaster = ref,
        };

    }

    async componentDidMount() {
        this.virtualLithiumHood = new VirtualLithiumHood(this.token, this.clientId, this.lithiumHoodId);
        this.virtualLithiumHood.lithiumHoodFunctions = {
            manageInitialLoading: this.manageInitialLoading,
            showError: this.showError,
            showToast: this.showToast,
            isLithiumHoodMembersDrawerOpen: this.isLithiumHoodMembersDrawerOpen,
            setLithiumHood: this.setLithiumHood,
            setLithiumRooms: this.setLithiumRooms,
            addLithiumRoom: this.addLithiumRoom,
            updateLastMessage: this.updateLastMessage,
            logout: this.logout,
        }
    }

    /**
     * Shows a regular, status-update toast
     */
    showToast = (message, icon='notifications', intent = Intent.PRIMARY) => {
        this.toaster.show({
            message: message,
            icon: icon ,
            intent: intent,
        });
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

    manageInitialLoading = (value) => {
        this.setState({
            isInitialLoadingDone: value,
        });
    }

    logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    setLithiumHood = (lithiumHood) => {
        this.setState({
            lithiumHood: lithiumHood,
            user: lithiumHood.user,
        });
    }

    setLithiumRooms = (lithiumRooms) => {
        this.setState({
            lithiumRooms: [...this.state.lithiumRooms, ...lithiumRooms],
        });
    }

    toggleNewLithiumRoomDialog = () => {
        this.setState({
            name: '',
            isNewLithiumRoomDialogOpened: !this.state.isNewLithiumRoomDialogOpened,
        })
    }

    handleNewLithiumRoomNameChange = (newName) => {
        this.setState({
            newLithiumRoomName: newName,
        })
    }

    createGroupLithiumRoom = () => {
        this.virtualLithiumHood.creatingGroupLithiumRoom(this.state.newLithiumRoomName);
        this.toggleNewLithiumRoomDialog();
    }

    addLithiumRoom = (lithiumRoom) => {
        const lithiumRooms = this.state.lithiumRooms;
        lithiumRooms.unshift(lithiumRoom);
        this.setState({
            lithiumRooms: lithiumRooms,
        });
    }

    toggleAccountDrawer = () => {
        this.setState({
            isAccountDrawerOpened: !this.state.isAccountDrawerOpened,
        });
    }

    toggleLithiumHoodMembersDrawer = () => {
        this.setState({
            isLithiumHoodMembersDrawerOpened: !this.state.isLithiumHoodMembersDrawerOpened,
        });
    }

    isLithiumHoodMembersDrawerOpen = () => {
        return this.state.isLithiumHoodMembersDrawerOpened;
    }

    updateLastMessage = (updatedLithiumRoom, message) => {
        const lithiumRooms = this.state.lithiumRooms;
        const changedLithiumRoom = lithiumRooms.find((lithiumRoom) => lithiumRoom.id === updatedLithiumRoom.id);
        if (changedLithiumRoom) {
            changedLithiumRoom.lastMessage = message;

            lithiumRooms.forEach(function(lithiumRoom,index){
                if (lithiumRoom.id === updatedLithiumRoom.id) {
                    lithiumRooms.splice(index, 1);
                    lithiumRooms.unshift(lithiumRoom);
                }
            });

            this.setState({
                lithiumRooms: lithiumRooms,
            })
        }
    }

    redirectToLithiumRoom = (id) => {
        window.location.href = `/lithiumRoom/${id}`;
    }

    render() {
        return (
            <div className={styles.home}>
                {!this.state.isInitialLoadingDone && <LoadingAnimation />}
                {/* Toast component*/}
                <Toaster position={Position.BOTTOM_RIGHT} ref={this.refHandlers.toaster}>
                    {this.state.toasts.map(toast => <Toast {...toast} />)}
                </Toaster>
                {this.state.isInitialLoadingDone && this.state.user && <div>
                    <nav className={styles.navbar}>
                        <div className={styles.trapezoid}>
                            <div className={styles.subnav}>
                                <button onClick={this.toggleAccountDrawer} className={styles.subnavbtn}>
                                    Account
                                </button>
                            </div>

                            <div className={styles.subnav}>
                                <button className={styles.subnavbtn}>
                                    Welcome back, {this.state.user.username}
                                </button>
                            </div>

                            <div className={styles.subnav}>
                                <button onClick={this.toggleLithiumHoodMembersDrawer} className={styles.subnavbtn}>
                                    Crew
                                </button>
                            </div>
                        </div>
                    </nav>

                    {this.state.lithiumRooms.length < 1 && <div className={styles.noLithiumRooms}>
                        <h3> Currently you do not have any Lithium Rooms :( </h3>
                        <h3> Let's create one </h3>
                    </div>}

                    <button className={styles.createRoomButton}
                            onClick={this.toggleNewLithiumRoomDialog}
                    >
                        Create Lithium Room
                    </button>

                    <main className={styles.main}>

                        {this.state.lithiumRooms.length >= 1 && <div className={styles.lithiumRoomsContainer}>
                            {this.state.lithiumRooms.map((chatRoom) => (
                                <div key={chatRoom.id}
                                     onClick={() => {
                                        this.redirectToLithiumRoom(chatRoom.id)
                                     }}
                                     className={styles.lithiumRoom}
                                >
                                    <div className={styles.lithiumRoomName}>{chatRoom.name}</div>
                                    <div className={styles.lithiumRoomInfo}>
                                        <div className={styles.lithiumRoomInfoLastMessage}>{chatRoom.lastMessage.user.username} : {chatRoom.lastMessage.content}</div>
                                        <div className={styles.lithiumRoomInfoLastMessageTime}>{chatRoom.lastMessage.sent_at_readable}</div>
                                    </div>
                                </div>
                            ))}
                        </div>}

                        <Drawer
                            className={styles.accountDrawer}
                            autoFocus={true}
                            position={'left'}
                            style={{width: '30%'}}
                            icon={'user'}
                            usePortal={false}
                            onClose={this.toggleAccountDrawer}
                            title="Ме"
                            isOpen={this.state.isAccountDrawerOpened}
                        >
                            <div className={Classes.DRAWER_BODY}>
                                <div className={Classes.DIALOG_BODY}>
                                    <Account user={this.state.user} logout={this.logout}/>
                                </div>
                            </div>
                        </Drawer>

                        <Drawer
                            className={styles.crewDrawer}
                            autoFocus={true}
                            position={'right'}
                            style={{width: '30%'}}
                            icon={'people'}
                            usePortal={false}
                            onClose={this.toggleLithiumHoodMembersDrawer}
                            title="My Crew"
                            isOpen={this.state.isLithiumHoodMembersDrawerOpened}
                        >
                            <div className={Classes.DRAWER_BODY}>
                                <div className={Classes.DIALOG_BODY}>
                                    <LithiumHoodMembers virtualLithiumHood={this.virtualLithiumHood}/>
                                </div>
                            </div>
                        </Drawer>

                        <Dialog
                            isOpen={this.state.isNewLithiumRoomDialogOpened}
                            onClose={this.toggleNewLithiumRoomDialog}
                            icon={'chat'}
                            title="Create Lithium Room"
                            style={{width: '700px'}}
                            className={styles.newLithiumRoomDialog}
                        >
                            <div className={Classes.DIALOG_BODY}>
                                <FormGroup>
                                    <Label> New Lithium Room Name
                                        <InputGroup
                                            value={this.state.newLithiumRoomName}
                                            type={'text'}
                                            fill={false}
                                            onChange={(event) => {
                                                const newName = event.target.value;
                                                this.handleNewLithiumRoomNameChange(newName);
                                            }}
                                            className={styles.newLithiumRoomInput}
                                        />
                                    </Label>
                                    <button onClick={this.createGroupLithiumRoom}
                                            className={styles.newLithiumRoomButton}
                                    > Create
                                    </button>
                                </FormGroup>
                            </div>
                        </Dialog>

                    </main>
                </div>}
            </div>
        )
    }
}

export default LithiumHood;