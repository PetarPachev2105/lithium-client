const {default: PQueue} = require('p-queue');

class VirtualLithiumHood {
    constructor(token, clientId, lithiumHoodId) {
        //The token
        this.token = token;

        // Unique Client Id
        this.clientId = clientId;

        // Lithium Space Id
        this.lithiumHoodId = lithiumHoodId;

        /* Set up the tasks queue for the VirtualLithiumRoom */
        this.queue = new PQueue({concurrency: 1});

        /** Functions provided to us by the LithiumHood component, for us to call without being exposed to the whole component */
        this.lithiumHoodFunctions = {
            manageInitialLoading: null,
            showError: null, // Used to display an error message to the user
            showToast: null,
            isLithiumHoodMembersDrawerOpen: null,
            setLithiumHood: null,
            setLithiumRooms: null,
            addLithiumRoom: null,
            receivedLithiumHood: null,
            receivedLithiumHoodRequests: null,
            sentLithiumHoodRequest: null,
            acceptedLithiumHoodRequest: null,
            declinedLithiumHoodRequest: null,
            removedLithiumHoodMember: null,
            updateLastMessage: null,
            logout: null,
        };

        this.eventListeners = {}

        this.eventList = {
            error: 'ERROR',
        }

        /* Create an instance of our API web worker */
        this.apiWorker = new Worker(new URL('./apiWorker.js', import.meta.url));
        this.initializeApiWorker();
        this.apiWorker.onmessage = async (e) => {
            const taskName = e.data.name;
            const taskPayload = e.data.payload;
            this.performApiWorkerUpdate(taskName, taskPayload);
        }

        this.websocketReceiverWorker = new Worker(new URL('./websocketReceiver.js', import.meta.url));
        this.websocketReceiverWorker.onmessage = async (e) => {
            const updates = e.data.payload.updates;
            updates.forEach((update) => {
                this.performWebsocketWorkerUpdate(update);
            });
        }

        this.lithiumRooms = [];
    }

    initializeApiWorker = () => {
        try {
            this.apiWorker.postMessage({
                name: 'init-home',
                payload: {
                    token: this.token,
                    clientId: this.clientId,
                    lithiumHoodId: this.lithiumHoodId,
                },
            });
        } catch (err) {
            console.log(`Worker init message send error: ${err}`);
        }
    }

    performApiWorkerUpdate = (name, payload) => {
        if (name === 'api-worker-initialized-home') {
            this.gettingLithiumHood();
            this.gettingLithiumRooms();
            this.initializeWebsocketWorker();
            this.lithiumHoodFunctions.manageInitialLoading(true);
        } else if (name === 'received-lithium-hood') {
            this.receivedLithiumHood(payload);
        } else if (name === 'received-lithium-rooms') {
            this.receivedLithiumRooms(payload);
        } else if (name === 'created-lithium-room') {
            this.createdGroupLithiumRoom(payload);
        } else if (name === 'received-lithium-hood-members') {
            this.receivedLithiumHoodMembers(payload);
        } else if (name === 'received-lithium-hood-requests') {
            this.receivedLithiumHoodRequests(payload);
        } else if (name === 'sent-lithium-hood-request') {
            this.sentLithiumHoodRequest(payload);
        } else if (name === 'accepted-lithium-hood-request') {
            this.acceptedLithiumHoodRequest(payload);
        } else if (name === 'declined-lithium-hood-request') {
            this.declinedLithiumHoodRequest(payload);
        } else if (name === 'removed-lithium-hood-member') {
            this.removedLithiumHoodMember(payload);
        } else if (name === 'error') {
            this.broadcastEvents(this.eventList.error, payload.message);
            this.lithiumHoodFunctions.showError(payload.message);
        }
    }

    initializeWebsocketWorker = () => {
        /* Send an initialization message to our worker */
        try {
            this.websocketReceiverWorker.postMessage({
                name: 'init',
                payload: {
                    clientId: this.clientId,
                    lithiumHoodId: this.lithiumHoodId,
                },
            });
        } catch (err) {
            console.log(`WebsocketReceiverWorker init message send error: ${err}`);
        }
    }

    performWebsocketWorkerUpdate = (update) => {
        const name = update.name;
        const payload = update.payload.message;
        if (name === 'received-request') {
            if (this.lithiumHoodFunctions.isLithiumHoodMembersDrawerOpen()) {
                this.receivedLithiumHoodRequests(payload);
            }
            this.lithiumHoodFunctions.showToast('You received hood request!');
        } else if (name === 'accepted-request') {
            if (this.lithiumHoodFunctions.isLithiumHoodMembersDrawerOpen()) {
                this.acceptedLithiumHoodRequest(payload);
            }
        } else if (name === 'removed-user-from-the-hood') {
            if (this.lithiumHoodFunctions.isLithiumHoodMembersDrawerOpen()) {
                this.removedLithiumHoodMember(payload, true);
            }
        } else if (name === 'automated-new-lithium-room') {
            this.receivedLithiumRooms(payload);
        } else if (name === 'received-message') {
            
            this.lithiumHoodFunctions.updateLastMessage(payload.lithiumRoom, payload.message);
        }
    }

    /**
     * If one of our custom events occurs broadcast it, so eventListeners can react to the change
     * @param eventName
     * @param payload
     */
    broadcastEvents = (eventName, payload) => {
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
    addEventListener = (eventName, listenerId, listener) => {

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
    removeEventListener = (listenerId) => {
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

    gettingLithiumHood = () => {
        try {
            this.apiWorker.postMessage({
                name: 'getting-lithium-hood',
                payload: {},
            });
        } catch (err) {
            console.log(`Worker init message send error: ${err}`);
        }
    }

    receivedLithiumHood = (lithiumHood) => {
        if (lithiumHood.id !== this.lithiumHoodId) {
            window.location.replace(`/lithiumHood/${lithiumHood.id}`);
        }
        this.lithiumHoodFunctions.setLithiumHood(lithiumHood);
    }

    gettingLithiumRooms = () => {
        try {
            this.apiWorker.postMessage({
                name: 'getting-lithium-rooms',
                payload: {},
            });
        } catch (err) {
            console.log(`Worker init message send error: ${err}`);
        }
    }

    receivedLithiumRooms = (lithiumRooms) => {
        if (!Array.isArray(lithiumRooms)) {
            lithiumRooms = [lithiumRooms];
        }
        this.lithiumHoodFunctions.setLithiumRooms(lithiumRooms);
    }

    creatingGroupLithiumRoom = (newLithiumRoomName) => {
        try {
            this.apiWorker.postMessage({
                name: 'creating-lithium-room',
                payload: {
                    newLithiumRoomName: newLithiumRoomName,
                },
            });
        } catch (err) {
            console.log(`Worker init message send error: ${err}`);
        }
    }

    createdGroupLithiumRoom = (lithiumRoom) => {
        this.lithiumHoodFunctions.addLithiumRoom(lithiumRoom);
        this.lithiumRooms.unshift(lithiumRoom);
        this.lithiumHoodFunctions.showToast('You successfully created a Lithium Room!');
    }

    gettingLithiumHoodMembers = () => {
        try {
            this.apiWorker.postMessage({
                name: 'getting-lithium-hood-members',
                payload: {},
            });
        } catch (err) {
            console.log(`Worker init message send error: ${err}`);
        }
    }

    receivedLithiumHoodMembers = (lithiumHoodMembers) => {
        this.lithiumHoodFunctions.receivedLithiumHoodMembers(lithiumHoodMembers);
    }

    sendingLithiumHoodRequest = (username) => {
        try {
            this.apiWorker.postMessage({
                name: 'sending-lithium-hood-request',
                payload: {
                    username: username
                },
            });
        } catch (err) {
            console.log(`Worker init message send error: ${err}`);
        }
    }

    sentLithiumHoodRequest = (user) => {
        this.lithiumHoodFunctions.sentLithiumHoodRequest();
        this.lithiumHoodFunctions.showToast(`You successfully sent a request to ${user.username}`);
    }

    gettingLithiumHoodRequests = () => {
        try {
            this.apiWorker.postMessage({
                name: 'getting-lithium-hood-requests',
                payload: {},
            });
        } catch (err) {
            console.log(`Worker init message send error: ${err}`);
        }
    }

    receivedLithiumHoodRequests = (lithiumHoodRequests) => {
        if (!Array.isArray(lithiumHoodRequests)) {
            lithiumHoodRequests = [lithiumHoodRequests];
        }
        this.lithiumHoodFunctions.receivedLithiumHoodRequests(lithiumHoodRequests);
    }

    acceptingLithiumHoodRequest = (lithiumHoodRequestId) => {
        try {
            this.apiWorker.postMessage({
                name: 'accepting-lithium-hood-request',
                payload: {
                    lithiumHoodRequestId: lithiumHoodRequestId,
                },
            });
        } catch (err) {
            console.log(`Worker init message send error: ${err}`);
        }
    }

    acceptedLithiumHoodRequest = (newLithiumHoodMember) => {
        this.lithiumHoodFunctions.acceptedLithiumHoodRequest(newLithiumHoodMember);
        this.lithiumHoodFunctions.showToast(`You have new member in the hood`);
    }

    decliningLithiumHoodRequest = (lithiumHoodRequestId) => {
        try {
            this.apiWorker.postMessage({
                name: 'declining-lithium-hood-request',
                payload: {
                    lithiumHoodRequestId: lithiumHoodRequestId,
                },
            });
        } catch (err) {
            console.log(`Worker init message send error: ${err}`);
        }
    }

    declinedLithiumHoodRequest = (user) => {
        this.lithiumHoodFunctions.declinedLithiumHoodRequest(user.username);
        this.lithiumHoodFunctions.showToast(`I understand I also do not like ${user.username}`);
    }

    removingLithiumHoodMember = (username) => {
        try {
            this.apiWorker.postMessage({
                name: 'removing-lithium-hood-member',
                payload: {
                    username: username,
                },
            });
        } catch (err) {
            console.log(`Worker init message send error: ${err}`);
        }
    }

    removedLithiumHoodMember = (user, isWebsocketUpdate = false) => {
        this.lithiumHoodFunctions.removedLithiumHoodMember(user.username);
        if (!isWebsocketUpdate) {
            this.lithiumHoodFunctions.showToast(`I understand I also do not like ${user.username}`);
        }
    }
}

export default VirtualLithiumHood;