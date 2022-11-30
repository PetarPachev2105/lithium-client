import React, {Component} from 'react';
import {Classes, Dialog, FormGroup, InputGroup, Label, Drawer} from '@blueprintjs/core';
import axios from "axios";
import styles from './home.module.css';
import Account from '../components/account';

class Home extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            logout: this.props.logout,
        }

        this.state = {
            showLogin: true,
            showSignUp: false,
            user: '',
            chatRooms: [],
            newLithiumRoomName: '',
            isNewLithiumRoomDialogOpened: false,
            isAccountDrawerOpened: false,
            isCrewDrawerOpened: false,
            working: false,
        }
    }

    async componentDidMount() {
        await this.getUser();
        await this.getChatRooms();
    }

    getUser = async () => {
        const response = await axios.get('http://localhost:5000/api/user/get_active_user', {
            headers: {
                Token: localStorage.getItem('token'),
            },
        });
        const user = response.data;
        this.setState({
            user: user,
        });
    }

    getChatRooms = async () => {
        const response = await axios.get('http://localhost:5000/api/chatRoom/get_chat_rooms', {
            headers: {
                Token: localStorage.getItem('token'),
            },
        });
        const chatRooms = response.data;
        this.setState({
            chatRooms: chatRooms,
        });
    }

    createChatRoom = async () => {
        const response = await axios.post('http://localhost:5000/api/chatRoom/create_chat_room', {
            name: this.state.newLithiumRoomName,
        }, {
            headers: {
                Token: localStorage.getItem('token'),
            },
        });
        await this.getChatRooms();
        this.toggleNewLithiumRoomDialog();
    }

    toggleNewLithiumRoomDialog = () => {
        this.setState({
            name: '',
            isNewLithiumRoomDialogOpened: !this.state.isNewLithiumRoomDialogOpened,
        })
    }

    toggleAccountDrawer = () => {
        this.setState({
            isAccountDrawerOpened: !this.state.isAccountDrawerOpened,
        });
    }

    toggleCrewDrawer = () => {
        this.setState({
            isCrewDrawerOpened: !this.state.isCrewDrawerOpened,
        });
    }

    handleNewLithiumRoomNameChange = (newName) => {
        this.setState({
            newLithiumRoomName: newName,
        })
    }

    redirectToLithiumRoom = (id) => {
        window.location.href = `/lithiumRoom/${id}`;
    }

    render() {
        return (
            <div className={styles.home}>
                {this.state.user && <div>
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
                                <button onClick={this.toggleCrewDrawer} className={styles.subnavbtn}>
                                    Crew
                                </button>
                            </div>
                        </div>
                    </nav>

                    {this.state.chatRooms.length < 1 && <div className={styles.noLithiumRooms}>
                        <h3> Currently you do not have any Lithium Rooms :( </h3>
                        <h3> Let's create one </h3>
                    </div>}

                    <button className={styles.createRoomButton}
                            onClick={this.toggleNewLithiumRoomDialog}
                    >
                        Create Lithium Room
                    </button>

                    <main className={styles.main}>

                        {this.state.chatRooms.length >= 1 && <div className={styles.lithiumRoomsContainer}>
                            {this.state.chatRooms.map((chatRoom) => (
                                <div key={chatRoom.id} onClick={() => {
                                    this.redirectToLithiumRoom(chatRoom.id)
                                }} className={styles.lithiumRoom}>
                                    <div className={styles.lithiumRoomName}>{chatRoom.name}</div>
                                    <div className={styles.lithiumRoomInfo}>
                                        <div
                                            className={styles.lithiumRoomInfoLastMessage}>{chatRoom.lastMessage.user.username} : {chatRoom.lastMessage.content}</div>
                                        <div
                                            className={styles.lithiumRoomInfoLastMessageTime}>{chatRoom.lastMessage.sent_at_readable} </div>
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
                                    <Account user={this.state.user} logout={this.parentFunctions.logout}/>
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
                            onClose={this.toggleCrewDrawer}
                            title="My Crew"
                            isOpen={this.state.isCrewDrawerOpened}
                        >
                            <div className={Classes.DRAWER_BODY}>
                                <div className={Classes.DIALOG_BODY}>

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
                                    <button onClick={this.createChatRoom}
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

export default Home;