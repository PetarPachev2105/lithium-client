const {default: PQueue} = require('p-queue');

function VirtualLithiumRoom(token, clientId, lithiumRoomId) {
    //The token
    this.token = token;

    // Unique Client Id
    this.clientId = clientId;

    // Lithium Room where we are;
    this.lithiumRoomId = lithiumRoomId;

    // Lithium Room where we are;
    this.lithiumSpaceId = null;

    this.name = null;

    this.username = null;

    // A flag to know when the Lithium Room has finished loading
    this.loaded = false;

    /* Set up the tasks queue for the VirtualLithiumRoom */
    this.queue = new PQueue({concurrency: 1});

    /* Create an instance of our API web worker */
    this.apiWorker = new Worker(new URL('./apiWorker.js', import.meta.url));
    this.websocketReceiverWorker = new Worker(new URL('./websocketReceiver.js', import.meta.url));

    this.messages = [];

    /** Functions provided to us by the LithiumRoom component, for us to call without being exposed to the whole component */
    this.lithiumRoomFunctions = {
        showError: null, // Used to display an error message to the user
        initialLoadingOfMessages: null,
        receiveMessage: null,
        loadOldMessages: null,
    };

    this.eventListeners = {}

    this.eventList = {
        addingMember: 'ADDING_MEMBER',
        addedMember: 'ADDED_MEMBER',
        removingMember: 'REMOVING_MEMBER',
        removedMember: 'REMOVED_MEMBER',
    }

    try {
        this.apiWorker.postMessage({
            name: 'init',
            payload: {
                clientId: this.clientId,
                token: this.token,
            },
        });
    } catch (err) {
        console.log(`Worker init message send error: ${err}`);
    }

    /* Set up our handling of messages coming from the API worker */
    this.apiWorker.onmessage = async (e) => {
        const taskName = e.data.name;
        const taskPayload = e.data.payload;
        if (taskName === 'api-worker-initialized') {
            this.apiWorker.postMessage({
                name: 'load-messages',
                payload: {
                    chatRoomId: this.lithiumRoomId,
                }
            });
            this.gettingLithiumSpace();
        } else if (taskName === 'messages-loaded') {
            this.setName(taskPayload.name);
            this.setUsername(taskPayload.username);
            this.initialLoadingOfMessages(taskPayload.messages);
        } else if (taskName === 'message-sent') {
            this.lithiumRoomFunctions.receiveMessage(taskPayload);
        } else if (taskName === 'added-member') {
            console.log('added-member');
        } else if (taskName === 'name-changed') {
            this.setName(taskPayload.name);
        } else if (taskName === 'member-removed') {
            console.log(taskPayload);
            this.memberRemoved(taskPayload);
        } else if (taskName === 'changed-member-permission') {
            this.changedMemberPermission(taskPayload);
        } else if (taskName === 'loaded-old-messages') {
            this.loadedOldMessages(taskPayload);
        } else if (taskName === 'received-lithium-space') {
            this.receivedLithiumSpace(taskPayload);
        } else if (taskName === 'error') {
            this.lithiumRoomFunctions.showError(taskPayload.message);
        }
    }

    this.websocketReceiverWorker.onmessage = async (e) => {
        // console.log(`websocketsReceiverWorker.onmessage (vw): ${e.data.name} - ${JSON.stringify(e.data.payload)}`);
        const taskName = e.data.name;
        const taskPayload = e.data.payload;

        if (taskName === 'websocket-updates') {
            /* This handles updates from the websocket received, so add a tasks to the queue to process them */
            await this.queue.add(async () => {
                this.performWebsocketUpdates(taskPayload.updates);
            });
        }
    }
}

/**
 * If one of our custom events occurs broadcast it, so eventListeners can react to the change
 * @param eventName
 * @param payload
 */
VirtualLithiumRoom.prototype.broadcastEvents = function (eventName, payload) {
    if (!this.eventList[eventName]) {
        // console.log('broadcastEvent', `WARNING: ${eventName} not found in eventsList`);
    }

    const listeners = this.eventListeners[eventName] || [];
    // console.log(`${listeners.length} subscribed to ${eventName}`);

    listeners.forEach((listenerEntry) => {
        listenerEntry.listener(payload);
    });
};

/**
 * Register Event Listener
 * @param eventName
 * @param listenerId
 * @param listener
 */
VirtualLithiumRoom.prototype.addEventListener = function (eventName, listenerId, listener) {

    const listeners = this.eventListeners[eventName] || [];
    listeners.push({
        listenerId,
        listener,
    });

    this.eventListeners[eventName] = listeners;
};

/**
 * Remove Event Listener
 * @param listenerId
 */
VirtualLithiumRoom.prototype.removeEventListener = function (listenerId) {
    Object.keys(this.eventListeners).forEach((eventName) => {
        const eventListeners = this.eventListeners[eventName];
        const newListeners = [];

        eventListeners.forEach((listenerEntry) => {
            if (listenerEntry.listenerId === listenerId) {
            } else {
                newListeners.push(listenerEntry);
            }
        });

        this.eventListeners[eventName] = newListeners;
    });
};

/**
 * Get lithium space
 */
VirtualLithiumRoom.prototype.gettingLithiumSpace = function () {
    try {
        this.apiWorker.postMessage({
            name: 'getting-lithium-space',
            payload: {
                clientId: this.clientId,
                token: this.token,
            },
        });
    } catch (err) {
        console.log(`Worker init message send error: ${err}`);
    }
}

/**
 * Receive lithium space
 */
VirtualLithiumRoom.prototype.receivedLithiumSpace = function (lithiumSpace) {
    this.lithiumSpaceId = lithiumSpace.id;
    console.log(lithiumSpace);
}

/**
 * Sets the name of the virtual lithium room
 * @param name
 */
VirtualLithiumRoom.prototype.setName = function (name) {
    this.name = name;
}

/**
 * Sets the username of the user
 * @param username
 */
VirtualLithiumRoom.prototype.setUsername = function (username) {
    this.username = username;
}

/**
 * Initial Loading of Messages
 * @param messages
 */
VirtualLithiumRoom.prototype.initialLoadingOfMessages = function (messages) {
    this.lithiumRoomFunctions.initialLoadingOfMessages(messages, this.username);

    /** Set up our websocket connection */
    this.setUpWebsockets();
}

/**
 * Send Message to the API Worker
 * @param content
 */
VirtualLithiumRoom.prototype.sendMessage = function (content) {
    try {
        this.apiWorker.postMessage({
            name: 'sending-message',
            payload: {
                chatRoomId: this.lithiumRoomId,
                content: content,
            },
        });
    } catch (err) {
        console.log(`Worker init message send error: ${err}`);
    }
}

/**
 * Set up our websockets
 */
VirtualLithiumRoom.prototype.setUpWebsockets = function () {
    /* Send an initialization message to our worker */
    try {
        this.websocketReceiverWorker.postMessage({
            name: 'init',
            payload: {
                clientId: this.clientId,
                sessionToken: this.token,
                lithiumRoomId: this.lithiumRoomId,
            },
        });
    } catch (err) {
        console.log(`WebsocketReceiverWorker init message send error: ${err}`);
    }
}

/**
 * Perform our websocket updates
 * @param allUpdates
 */
VirtualLithiumRoom.prototype.performWebsocketUpdates = function (allUpdates) {
    // console.log(`performWebsocketUpdates got ${allUpdates.length}`);
    /* Iterate through all the updates */
    allUpdates.forEach(async (update) => {
        // console.log(`websocket update.name => ${update.name}`);
        // console.log(`websocket update.payload => ${JSON.stringify(update.payload)}`);

        if (update.name === 'message-received') {
            this.lithiumRoomFunctions.receiveMessage(update.payload.message)
        }
    });
};

/**
 * Tell API worker we are going to Add Members
 * @param username
 */
VirtualLithiumRoom.prototype.addMember = function (username) {
    /* Send a message to our worker */
    try {
        this.apiWorker.postMessage({
            name: 'adding-member',
            payload: {
                lithiumRoomId: this.lithiumRoomId,
                username: username
            },
        });
    } catch (err) {
        console.log(`WebsocketReceiverWorker init message send error: ${err}`);
    }
}

/**
 * Tell API worker we are going to Remove Members
 * @param username
 */
VirtualLithiumRoom.prototype.removeMember = function (username) {
    /* Send a message to our worker */
    try {
        this.apiWorker.postMessage({
            name: 'removing-member',
            payload: {
                lithiumRoomId: this.lithiumRoomId,
                username: username
            },
        });
    } catch (err) {
        console.log(`WebsocketReceiverWorker init message send error: ${err}`);
    }
}

/**
 * Member is successfully removed
 * @param params
 */
VirtualLithiumRoom.prototype.memberRemoved = function (params) {
    this.broadcastEvents(this.eventList.removedMember, params);
    this.lithiumRoomFunctions.showToast(`User ${params.username} successfully removed`)
}

/**
 * Change Member Permission currently not in use
 * @param username
 * @param permission
 */
VirtualLithiumRoom.prototype.changeMemberPermission = function (username, permission) {
    /* Send an initialization message to our worker */
    try {
        this.apiWorker.postMessage({
            name: 'changing-member-permission',
            payload: {
                lithiumRoomId: this.lithiumRoomId,
                username: username,
                permission: permission,
            },
        });
    } catch (err) {
        console.log(`WebsocketReceiverWorker init message send error: ${err}`);
    }
}

/**
 * Successfully changed permission
 * @param params
 */
VirtualLithiumRoom.prototype.changedMemberPermission = function (params) {
    console.log(params);
}

/**
 * Lithium Room Name Changed
 * @param name
 */
VirtualLithiumRoom.prototype.changeName = function (name) {
    try {
        this.apiWorker.postMessage({
            name: 'changing-name',
            payload: {
                lithiumRoomId: this.lithiumRoomId,
                name: name
            },
        });
    } catch (err) {
        console.log(`WebsocketReceiverWorker init message send error: ${err}`);
    }
}

/**
 * Tell Api Worker we are going to load old messages
 * @param number
 */
VirtualLithiumRoom.prototype.loadingOldMessages = function (number) {
    try {
        this.apiWorker.postMessage({
            name: 'loading-old-messages',
            payload: {
                lithiumRoomId: this.lithiumRoomId,
                message_number: number,
            },
        });
    } catch (err) {
        console.log(`WebsocketReceiverWorker init message send error: ${err}`);
    }
}

/**
 * Old Messages Loaded
 * @param messages
 */
VirtualLithiumRoom.prototype.loadedOldMessages = function (messages) {
    this.lithiumRoomFunctions.loadOldMessages(messages);
}

export default VirtualLithiumRoom;