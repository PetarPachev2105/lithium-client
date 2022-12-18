import React, { Component } from "react";
import {
  Classes,
  Dialog,
  FormGroup,
  Intent,
  Position,
  Toaster,
  Toast,
  Icon,
} from "@blueprintjs/core";
import { HotKeys } from "react-hotkeys";

import VirtualLithiumRoom from "../models/virtualLithiumRoom";
import { v1 } from "uuid";
import styles from "./lithiumRoom.module.css";
import appStyles from "../App.css";

import AddMemberMenu from "../components/addMemberMenu";
import ChangeLithiumRoomNameMenu from "../components/changeLithiumRoomNameMenu";
import ManageMembersMenu from "../components/manageMembers";

class LithiumRoom extends Component {
  constructor(props) {
    super(props);

    this.lithiumRoomId = this.props.match.params.lithiumRoomId;

    this.token = localStorage.getItem("token");

    this.clientId = v1();

    this.state = {
      openedSettingsDialog: false,
      messages: [],
      toasts: [],
      isInitialLoadingDone: false,
      username: false,
      newMessageContent: "",
      openedAddMemberMenu: false,
      openedChangeLithiumRoomNameMenu: false,
      openedManageMembersMenu: false,
      initialScrollDone: false,
      isFirstMessageInViewport: false,
      isFirstMessageInViewportCount: 0,
    };

    this.virtualLithiumRoom = null;

    this.toaster = Toaster;
    this.refHandlers = {
      toaster: (ref) => (this.toaster = ref),
    };

    this.lithiumRoomRef = React.createRef(null);
    this.firstMessageRef = React.createRef(null);
    this.lastMessageRef = React.createRef(null);
  }

  /**
   * Custom debounce function
   * @param fn
   * @param delay
   * @returns {(function(): void)|*}
   */
  debounce(fn, delay) {
    let timer = null;
    return function () {
      let context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  componentDidMount() {
    /* Instantiate a virtualLithiumRoom and tell it to load itself based on which room we are in */
    this.virtualLithiumRoom = new VirtualLithiumRoom(
      this.token,
      this.clientId,
      this.lithiumRoomId
    );
    this.virtualLithiumRoom.lithiumRoomFunctions = {
      showError: this.showError,
      initialLoadingOfMessages: this.initialLoadingOfMessages,
      receiveMessage: this.receiveMessage,
      loadOldMessages: this.loadOldMessages,
    };
    this.scrollToBottom();

    window.addEventListener("scroll", () => {
      // Create instance of observer
      const observer = new IntersectionObserver(
        ([entry]) => this.isFirstMessageInViewport(entry.isIntersecting),
        { rootMargin: "60px" }
      );
      // Our custom onScroll function
      this.onWindowScroll(observer);
    });
  }

  /**
   * Shows a regular, status-update toast
   */
  showToast = (toastData) => {
    this.toaster.show({
      message: toastData.message,
      icon: toastData.icon || "notifications",
      intent: toastData.intent,
      timeout: toastData.timeout,
    });
  };

  /**
   * Shows an error toast
   */
  showError = (err) => {
    // Extract an error message to show the user
    const errorMessage =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.toString();
    this.toaster.show({
      message: errorMessage,
      icon: "issue",
      intent: Intent.DANGER,
    });
  };

  /**
   * Custom function to scroll to the last message
   */
  scrollToBottom = () => {
    this.lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Custom onScrollFunction for now just observe first message to tell us if it is visible or not
   * @param observer
   */
  onWindowScroll = (observer) => {
    observer.observe(this.firstMessageRef.current);
  };

  /**
   * First loading of messages (maybe we should combine it with loadOldMessages)
   * @param messages
   * @param username
   */
  initialLoadingOfMessages = (messages, username) => {
    if (messages.length > 0) {
      const firstMessage = messages[0];
      firstMessage.isFirstMessage = true;
      const lastMessage = messages.slice(-1)[0];
      lastMessage.isLastMessage = true;
    }
    this.setState(
      {
        messages: messages,
        isInitialLoadingDone: true,
        username: username,
      },
      this.scrollToBottom
    );
  };

  /**
   * Sends message to the virtualLithiumRoom and empty the state
   */
  sendMessage = () => {
    this.virtualLithiumRoom.sendMessage(this.state.newMessageContent);
    this.setState({
      newMessageContent: "",
    });
  };

  /**
   * Change message content value in the state
   * @param newContent
   */
  handleNewMessageContentChange = (newContent) => {
    this.setState({
      newMessageContent: newContent,
    });
  };

  /**
   * Adds received message to the end of the this.state.messages, and it is marked as lastMessage
   * @param message
   */
  receiveMessage = (message) => {
    const messages = this.state.messages;

    const previousLastMessage = messages.find(
      (message) => message.isLastMessage === true
    );
    if (previousLastMessage) {
      delete previousLastMessage.isLastMessage;
    }

    message.isLastMessage = true;
    messages.push(message);
    this.setState(
      {
        messages: messages,
      },
      () => {
        this.scrollToBottom();
      }
    );
  };

  /**
   * If first message of the currently loaded is in the viewport then load old messages
   * @type {(function(): void)|*}
   */
  isFirstMessageInViewport = this.debounce((value) => {
    if (value) {
      this.setState(
        {
          isFirstMessageInViewport: value,
          isFirstMessageInViewportCount:
            this.state.isFirstMessageInViewportCount + 1,
          loadingOldMessages: true,
        },
        () => {
          this.loadingOldMessages();
        }
      );
    }
  }, 300);

  /**
   * Decide if we should call old messages to load or not (currently we load 100 messages so if messages in the state are less than 100
   * or not divisible by 100 probably we do not have more messages to load )
   */
  loadingOldMessages = () => {
    if (this.state.messages.length % 100 === 0) {
      const messages = this.state.messages;
      const firstMessage = messages.find(
        (message) => message.isFirstMessage === true
      );
      this.virtualLithiumRoom.loadingOldMessages(firstMessage.number);
    }
  };

  /**
   * Actual load of messages
   * @param messages
   */
  loadOldMessages = (messages) => {
    let newMessages = messages;
    newMessages.push(...this.state.messages);

    newMessages = newMessages.sort((m1, m2) =>
      m1.number > m2.number ? 1 : m1.number < m2.number ? -1 : 0
    );

    const firstMessage = messages.find(
      (message) => message.isFirstMessage === true
    );
    if (firstMessage) {
      delete firstMessage.isFirstMessage;
    }

    const newFirstMessage = newMessages[0];
    newFirstMessage.isFirstMessage = true;

    this.setState({
      messages: newMessages,
      loadingOldMessages: false,
    });
  };

  /**
   * Opens the settings dialog
   */
  openSettings = () => {
    this.setState({
      openedSettingsDialog: true,
    });
  };

  /**
   * Closes the settings dialog
   */
  closeSettingsDialog = () => {
    this.setState({
      openedSettingsDialog: false,
    });
  };

  /**
   * Opens Add Member Menu
   */
  openAddMemberMenu = () => {
    this.setState({
      openedAddMemberMenu: true,
    });
  };

  /**
   * Closes Add Member Menu
   */
  closeAddMemberMenu = () => {
    this.setState({
      openedAddMemberMenu: false,
    });
  };

  /**
   * Opens Change Lithium Room Name Menu
   */
  openChangeLithiumRoomNameMenu = () => {
    this.setState({
      openedChangeLithiumRoomNameMenu: true,
    });
  };

  /**
   *Closes Change Lithium Room Name Menu
   */
  closeChangeLithiumRoomNameMenu = () => {
    this.setState({
      openedChangeLithiumRoomNameMenu: false,
    });
  };

  /**
   * Opens Manage Members Menu
   */
  openManageMembersMenu = () => {
    this.setState({
      openedManageMembersMenu: true,
    });
  };

  /**
   * Closes Manage Members Menu
   */
  closeManageMembersMenu = () => {
    this.setState({
      openedManageMembersMenu: false,
    });
  };

  /**
   * Dummy redirect to lithiumHoodMembers
   */
  backToLithiumSpace = () => {
    window.location.href = `/lithiumSpace/${this.virtualLithiumRoom.lithiumSpaceId}`;
  };

  render() {
    const keyMap = {
      SEND_MESSAGE: "enter",
    };

    const handlers = {
      SEND_MESSAGE: this.sendMessage,
    };

    return (
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <div>
          {/* Toast component*/}
          <Toaster
            position={Position.BOTTOM_RIGHT}
            ref={this.refHandlers.toaster}
          >
            {this.state.toasts.map((toast) => (
              <Toast {...toast} />
            ))}
          </Toaster>
          {!this.state.isInitialLoadingDone && <div>Loading...</div>}

          {this.state.openedAddMemberMenu && (
            <AddMemberMenu
              virtualLithiumRoom={this.virtualLithiumRoom}
              closeAddMemberMenu={this.closeAddMemberMenu}
              closeSettingsDialog={this.closeSettingsDialog}
            />
          )}
          {this.state.openedChangeLithiumRoomNameMenu && (
            <ChangeLithiumRoomNameMenu
              virtualLithiumRoom={this.virtualLithiumRoom}
              closeChangeLithiumRoomNameMenu={
                this.closeChangeLithiumRoomNameMenu
              }
              closeSettingsDialog={this.closeSettingsDialog}
            />
          )}
          {this.state.openedManageMembersMenu && (
            <ManageMembersMenu
              virtualLithiumRoom={this.virtualLithiumRoom}
              closeManageMembersMenu={this.closeManageMembersMenu}
              closeSettingsDialog={this.closeSettingsDialog}
            />
          )}

          <Dialog
            className={appStyles.dialog}
            isOpen={this.state.openedSettingsDialog}
            onClose={this.closeSettingsDialog}
            icon="cog"
            title="Settings"
            style={{ width: "700px" }}
          >
            <div className={Classes.DIALOG_BODY}>
              <button
                className={styles.largeButton}
                onClick={this.openAddMemberMenu}
              >
                Add Member
              </button>
              <button
                className={styles.largeButton}
                onClick={this.openChangeLithiumRoomNameMenu}
              >
                Change Lithium Room Name
              </button>
              <button
                className={styles.largeButton}
                onClick={this.openManageMembersMenu}
              >
                Manage Members Menu
              </button>
              <button
                className={styles.largeButton}
                onClick={this.backToLithiumSpace}
              >
                Back to My Lithium Space
              </button>
            </div>
          </Dialog>

          {this.state.isInitialLoadingDone && (
            <section className={styles.lithiumRoom}>
              <header className={styles.lithiumRoomHeader}>
                <Icon
                  icon={"arrow-left"}
                  iconSize={20}
                  style={{ cursor: "pointer" }}
                  onClick={this.backToLithiumSpace}
                />
                <span className={styles.lithiumRoomChatName}>
                  {this.virtualLithiumRoom.name}
                </span>
                <Icon
                  icon={"cog"}
                  iconSize={20}
                  style={{ cursor: "pointer" }}
                  onClick={this.openSettings}
                />
              </header>
              <main className={styles.lithiumChat} ref={this.lithiumRoomRef}>
                {this.state.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.lithiumMessage} ${
                      message.user.username === this.state.username
                        ? styles.rightLithiumMessage
                        : styles.leftLithiumMessage
                    }`}
                  >
                    {message.isFirstMessage && (
                      <div className="first" ref={this.firstMessageRef} />
                    )}
                    <div className={styles.lithiumMessageImage} />
                    <div className={styles.lithiumMessageBubble}>
                      <div className={styles.lithiumMessageInfo}>
                        <div className={styles.lithiumMessageInfoName}>
                          {message.user.username}
                        </div>
                        <div className={styles.lithiumMessageInfoTime}>
                          {message.sent_at_readable}
                        </div>
                      </div>

                      <div
                        className={
                          message.user.username === this.state.username
                            ? styles.lithiumMessageContentRight
                            : styles.lithiumMessageContentLeft
                        }
                      >
                        {message.content}
                      </div>
                      {message.isLastMessage && (
                        <div className="here" ref={this.lastMessageRef} />
                      )}
                    </div>
                  </div>
                ))}
              </main>
              <FormGroup
                style={{ margin: "0" }}
                className={styles.lithiumRoomNewMessage}
              >
                <input
                  value={this.state.newMessageContent}
                  className={styles.lithiumRoomMessageInput}
                  onChange={(event) => {
                    const newContent = event.target.value;
                    this.handleNewMessageContentChange(newContent);
                  }}
                />
                <button
                  onClick={this.sendMessage}
                  className={styles.lithiumRoomMessageSend}
                >
                  Send
                </button>
              </FormGroup>
            </section>
          )}
        </div>
      </HotKeys>
    );
  }
}

export default LithiumRoom;
