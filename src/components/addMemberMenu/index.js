import React, { Component, Fragment } from 'react';
import { Button, Classes, Dialog, FormGroup, InputGroup, Intent, Label } from '@blueprintjs/core';

class AddMemberMenu extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            closeAddMemberMenu: this.props.closeAddMemberMenu,
            closeSettingsDialog: this.props.closeSettingsDialog,
        }

        this.virtualLithiumRoom = this.props.virtualLithiumRoom;

        this.state = {
            isOpened: false,
            username: '',
        }
    }

    componentDidMount() {
        this.setState({
            isOpened: true,
        })
    }

    handleUsernameChange = (newUsername) => {
        this.setState({
            username: newUsername,
        })
    }

    addMember = () => {
        this.virtualLithiumRoom.addMember(this.state.username);
        this.parentFunctions.closeAddMemberMenu();
        this.parentFunctions.closeSettingsDialog();
    }

    render() {
        return (
            <Fragment>
                <Dialog
                    isOpen={this.state.isOpened}
                    onClose={this.parentFunctions.closeAddMemberMenu}
                    icon="new-layer"
                    title="Add Member"
                    style={{ width: '700px' }}
                >
                    <div className={Classes.DIALOG_BODY}>
                        <FormGroup>
                            <Label> Username:
                                <InputGroup
                                    value={this.state.username}
                                    type={'text'}
                                    fill={false}
                                    onChange={(event) => {
                                        const newUsername = event.target.value;
                                        this.handleUsernameChange(newUsername);
                                    }}
                                />
                            </Label>
                            <Button style={{ marginTop: '20px' }}
                                    intent={Intent.PRIMARY}
                                    onClick={this.addMember}
                                    text={'Add'}
                                    minimal={false}
                                    outlined={false}
                                    alignText={'left'}
                                    // loading={this.state.working}
                            />
                        </FormGroup>
                    </div>
                </Dialog>

            </Fragment>
        )
    }
}

export default AddMemberMenu;