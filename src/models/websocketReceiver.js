/* eslint no-restricted-globals: 0 */
const {default: PQueue} = require('p-queue');

/* Stores the client id of the parent lithium room */
let clientId = null;

/* The Lithium Room ID that we are watching websocket messages for */
let lithiumRoomId = null;

/* Variable to hold our websocket client object */
let ws = null;

/* Set up our task queue */
const queue = new PQueue({concurrency: 1});

/* Array to buffer updates we'll send back to the lithium room */
const lithiumRoomUpdateBuffer = [];


async function setUpWebsockets() {
    // console.log('worker - setUpWebsockets');

    /* Set up websockets - pass our lithium room id as the identifier */
    ws = new WebSocket(`ws://localhost:5001?clientId=${clientId}&lithiumRoomId=${lithiumRoomId}`);

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
        setUpWebsockets(); /* Restart websockets */
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
    const updateLength = lithiumRoomUpdateBuffer.length;
    // console.log(`updateLength: ${updateLength}`);

    const updatesToSendOut = [];
    for (let count = 0; count < updateLength; count++) {
        const update = lithiumRoomUpdateBuffer.shift();
        if (update) {
            updatesToSendOut.push(update);
        }
    }

    // console.log(`updatesToSendOut: ${JSON.stringify(updatesToSendOut)}`);
    // console.log(`updatesToSendOut.length: ${updatesToSendOut.length}`);

    if (updatesToSendOut.length > 0) {
        // console.log('sending out');
        this.postMessage({
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
        lithiumRoomId = taskPayload.lithiumRoomId;

        await setUpWebsockets();

        /* Start the bulk buffer update checker */
        setTimeout(() => {
            checkBuffer();
        }, 1000 * 10);
    }
};