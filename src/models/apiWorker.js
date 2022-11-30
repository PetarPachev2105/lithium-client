/* eslint no-restricted-globals: 0 */
import axios from 'axios';

const {default: PQueue} = require('p-queue');

const apiUrl = 'http://localhost:5000/api';

const axiosClient = axios.create({timeout: 1000 * 60 * 15}); // Create custom Axios client, with a large timeout

/* Stores the client id of the parent virtual lithium room */
let clientId = null;

/* The session token we need to provide in the API calls */
let token = null;

/* Set up our task queue */
const queue = new PQueue({concurrency: 1});

/**
 * A helper function to send back error messages back to the virtual lithium room
 * @param functionName
 * @param err
 */
function sendErrorMessage(functionName, err) {
    /* Extract the error message here, as we only pass a string back to the virtual lithium room, vs. the full object */
    const errorMessage = err.response && err.response.data && err.response.data.message ? err.response.data.message : err.toString();
    self.postMessage({
        name: 'error',
        payload: {
            message: `${errorMessage}`,
        },
    });
}

/**
 * A helper function to send that api worker is initialized successfully
 */
function apiWorkerInitialized() {
    try {
        self.postMessage({
            name: 'api-worker-initialized',
            payload: {},
        });
    } catch (err) {
        sendErrorMessage('apiWorkerInitialized', err)
    }
}

/**
 * Send to API to load all messages from server
 */
async function loadMessagesFromServer(params) {
    try {
        const chatRoomId = params.chatRoomId;
        const response = await axiosClient.get(`${apiUrl}/chatRoom/${chatRoomId}/enter_chat_room`, {
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'messages-loaded',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('loadMessagesFromServer', err)
    }
}

/**
 * Sends the new message to the API
 * @param params
 * @returns {Promise<void>}
 */
async function sendMessage(params) {
    try {
        const chatRoomId = params.chatRoomId;
        const response = await axiosClient.post(`${apiUrl}/chatRoom/${chatRoomId}/send_message`, {
            content: params.content,
        }, {
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'message-sent',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Send potentially new member username to the API
 * @param params
 * @returns {Promise<void>}
 */
async function addMember(params) {
    try {
        const lithiumRoomId = params.lithiumRoomId;
        const response = await axiosClient.post(`${apiUrl}/chatRoom/${lithiumRoomId}/add_member`, {
            username: params.username,
        }, {
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'added-member',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Sends the new name of the lithium room to the api
 * @param params
 * @returns {Promise<void>}
 */
async function changeName(params) {
    try {
        const lithiumRoomId = params.lithiumRoomId;
        const response = await axiosClient.post(`${apiUrl}/chatRoom/${lithiumRoomId}/change_name`, {
            name: params.name,
        }, {
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'name-changed',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('changeName', err)
    }
}

/**
 * Remove Member from the Lithium Room
 * @param params
 * @returns {Promise<void>}
 */
async function removeMember(params) {
    try {
        const lithiumRoomId = params.lithiumRoomId;
        const response = await axiosClient.post(`${apiUrl}/chatRoom/${lithiumRoomId}/remove_member`, {
            username: params.username,
        }, {
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'member-removed',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('removeMember', err)
    }
}

/**
 * Changes member permissions (currently not in use)
 * @param params
 * @returns {Promise<void>}
 */
async function changeMemberPermission(params) {
    try {
        const lithiumRoomId = params.lithiumRoomId;
        const response = await axiosClient.post(`${apiUrl}/chatRoom/${lithiumRoomId}/change_member_permission`, {
            username: params.username,
            permission: params.permission,
        }, {
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'changed-member-permission',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('changeMemberPermission', err)
    }
}

/**
 * Loads old messages from the server
 * @param params
 * @returns {Promise<void>}
 */
async function loadOldMessages(params) {
    try {
        const lithiumRoomId = params.lithiumRoomId;
        const response = await axiosClient.get(`${apiUrl}/chatRoom/${lithiumRoomId}/${params.message_number}/load_old_messages`, {
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'loaded-old-messages',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('loadOldMessages', err)
    }
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
        token = taskPayload.token;
        await queue.add(async () => {
            await apiWorkerInitialized();
        });
    } else if (taskName === 'load-messages') {
        await queue.add(async () => {
            await loadMessagesFromServer(taskPayload);
        });
    } else if (taskName === 'sending-message') {
        await queue.add(async () => {
            await sendMessage(taskPayload);
        });
    } else if (taskName === 'adding-member') {
        await queue.add(async () => {
            await addMember(taskPayload);
        });
    } else if (taskName === 'removing-member') {
        await queue.add(async () => {
            await removeMember(taskPayload);
        });
    } else if (taskName === 'changing-name') {
        await queue.add(async () => {
            await changeName(taskPayload);
        });
    } else if (taskName === 'removing-name') {
        await queue.add(async () => {
            await removeMember(taskPayload);
        });
    } else if (taskName === 'changing-member-permission') {
        await queue.add(async () => {
            await changeMemberPermission(taskPayload);
        });
    } else if (taskName === 'loading-old-messages') {
        await queue.add(async () => {
            await loadOldMessages(taskPayload);
        });
    }
};