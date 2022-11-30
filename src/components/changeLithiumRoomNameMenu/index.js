import React, { Component } from 'react';
import { Button, Classes, Dialog, FormGroup, InputGroup, Intent, Label } from '@blueprintjs/core';

class ChangeLithiumRoomNameMenu extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            closeChangeLithiumRoomNameMenu: this.props.closeChangeLithiumRoomNameMenu,
            closeSettingsDialog: this.props.closeSettingsDialog,
        }

        this.virtualLithiumRoom = this.props.virtualLithiumRoom;

        this.state = {
            isOpened: false,
            newName: '',
        }
    }

    componentDidMount() {
        this.setState({
            isOpened: true,
        })
    }

    handleNameChange = (newName) => {
        this.setState({
            newName: newName,
        })
    }

    changeName = () => {
        this.virtualLithiumRoom.changeName(this.state.newName);
        this.parentFunctions.closeChangeLithiumRoomNameMenu();
        this.parentFunctions.closeSettingsDialog();
    }

    render() {
        return (
            <div>
                <Dialog
                    isOpen={this.state.isOpened}
                    onClose={this.parentFunctions.closeChangeLithiumRoomNameMenu}
                    icon="new-layer"
                    title="Change Lithium Room Name"
                    style={{ width: '700px' }}
                >
                    <div className={Classes.DIALOG_BODY}>
                        <FormGroup>
                            <Label> New Name:
                                <InputGroup
                                    value={this.state.newName}
                                    type={'text'}
                                    fill={false}
                                    onChange={(event) => {
                                        const newName = event.target.value;
                                        this.handleNameChange(newName);
                                    }}
                                />
                            </Label>
                            <Button style={{ marginTop: '20px' }}
                                    intent={Intent.PRIMARY}
                                    onClick={this.changeName}
                                    text={'Change'}
                                    minimal={false}
                                    outlined={false}
                                    alignText={'left'}
                                // loading={this.state.working}
                            />
                        </FormGroup>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default ChangeLithiumRoomNameMenu;