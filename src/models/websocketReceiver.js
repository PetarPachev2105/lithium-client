import config from '../config/index';

/* eslint no-restricted-globals: 0 */
const {default: PQueue} = require('p-queue');

/* Stores the client id of the parent lithium room */
let clientId = null;

/* The Lithium Room ID that we are watching websocket messages for */
let lithiumRoomId = null;

/* The Lithium Hood ID that we are watching websocket messages for */
let lithiumHoodId = null;

/* Variable to hold our websocket client object */
let ws = null;

/* Set up our task queue */
const queue = new PQueue({concurrency: 1});

/* Array to buffer updates we'll send back to the lithium hood */
const lithiumHoodUpdateBuffer = [];

/* Array to buffer updates we'll send back to the lithium room */
const lithiumRoomUpdateBuffer = [];


async function setUpLithiumHoodWebsockets() {
    // console.log('worker - setUpWebsockets');

    /* Set up websockets - pass our lithium room id as the identifier */
    ws = new WebSocket(`${config.WEBSOCKET_URL}?clientId=${clientId}&lithiumHoodId=${lithiumHoodId}`);

    ws.onopen = () => {
        // console.log('WebSocket Client Connected');
    };
    ws.onmessage = async (message) => {
        const messageData = JSON.parse(message.data);

        /* If *this* client is the original sender of the websockets message or it is not automated, then skip **/
        if (messageData.sourceId === clientId && !messageData.type.includes('automated')) {
            return;
        }

        if (messageData.type === 'received-request') {
            await queue.add(async () => {
                /* Send a message to the VirtualLithiumRoom that message is received */
                lithiumHoodUpdateBuffer.push({
                    name: 'received-request',
                    payload: {
                        message: messageData.payload,
                    },
                });
            });
        } else if (messageData.type === 'accepted-request') {
            lithiumHoodUpdateBuffer.push({
                name: 'accepted-request',
                payload: {
                    message: messageData.payload,
                },
            });
        } else if (messageData.type === 'removed-user-from-the-hood') {
            lithiumHoodUpdateBuffer.push({
                name: 'removed-user-from-the-hood',
                payload: {
                    message: messageData.payload,
                },
            });
        } else if (messageData.type === 'automated-new-lithium-room') {
            lithiumHoodUpdateBuffer.push({
                name: 'automated-new-lithium-room',
                payload: {
                    message: messageData.payload,
                },
            });
        } else if (messageData.type === 'received-message') {
            lithiumHoodUpdateBuffer.push({
                name: 'received-message',
                payload: {
                    message: messageData.payload,
                },
            });
        }
    };
    ws.onclose = () => {
        setUpLithiumHoodWebsockets(); /* Restart websockets */
    };

    ws.onerror = async (err) => {
        console.log(err);
    }
}


async function setUpLithiumRoomWebsockets() {
    // console.log('worker - setUpWebsockets');

    /* Set up websockets - pass our lithium room id as the identifier */
    ws = new WebSocket(`${config.WEBSOCKET_URL}?clientId=${clientId}&lithiumRoomId=${lithiumRoomId}`);

    ws.onopen = () => {
        // console.log('WebSocket Client Connected');
    };
    ws.onmessage = async (message) => {
        const messageData = JSON.parse(message.data);

        /* If *this* client is the original sender of the websockets message or it is not automated, then skip **/
        if (messageData.sourceId === clientId && !messageData.type.includes('automated')) {
            return;
        }

        if (messageData.type === 'message-received' || messageData.type === 'automated-message') {
            await queue.add(async () => {
                /* Send a message to the VirtualLithiumRoom that message is received */
                lithiumRoomUpdateBuffer.push({
                    name: 'message-received',
                    payload: {
                        message: messageData.payload,
                    },
                });
            });
        }
    };
    ws.onclose = () => {
        setUpLithiumRoomWebsockets(); /* Restart websockets */
    };

    ws.onerror = async (err) => {
        console.log(err);
    }
}

/**
 * Function periodically checks if we have buffered updates that we need to send out to the virtualLithiumRoom, and if yes, it sends them out
 * @returns {Promise<void>}
 */
async function checkBuffer() {
    const updates = lithiumHoodId ? lithiumHoodUpdateBuffer : lithiumRoomUpdateBuffer
    const updateLength = updates.length;
    // console.log(`updateLength: ${updateLength}`);

    const updatesToSendOut = [];
    for (let count = 0; count < updateLength; count++) {
        const update = updates.shift();
        if (update) {
            updatesToSendOut.push(update);
        }
    }

    // console.log(`updatesToSendOut: ${JSON.stringify(updatesToSendOut)}`);
    // console.log(`updatesToSendOut.length: ${updatesToSendOut.length}`);

    if (updatesToSendOut.length > 0) {
        // console.log('sending out');
        self.postMessage({
            name: 'websocket-updates',
            payload: {
                updates: updatesToSendOut,
            },
        });
    }

    // queue.start();

    setTimeout(() => {
        checkBuffer();
    }, 1000 * 5);
}


/**
 * Main message receiver
 * @param e
 * @returns {Promise<void>}
 */
self.onmessage = async (e) => {
    // console.log(`e.data: ${JSON.stringify(e.data)}`);
    const taskName = e.data.name;
    const taskPayload = e.data.payload;

    // console.log(`apiWorker - received task ${taskName} with ${JSON.stringify(taskPayload)}`);

    if (taskName === 'init') {
        /* Initialization code */
        clientId = taskPayload.clientId;
        if (taskPayload.lithiumHoodId) {
            lithiumHoodId = taskPayload.lithiumHoodId;
            await setUpLithiumHoodWebsockets();
        } else if (taskPayload.lithiumRoomId) {
            lithiumRoomId = taskPayload.lithiumRoomId;
            await setUpLithiumRoomWebsockets();
        }

        /* Start the bulk buffer update checker */
        setTimeout(() => {
            checkBuffer();
        }, 1000 * 10);
    }
};