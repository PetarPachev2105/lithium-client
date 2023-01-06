/* eslint no-restricted-globals: 0 */
import axios from 'axios';
import config from '../config/index';

const {default: PQueue} = require('p-queue');

const apiUrl = config.API_URL;

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

/* HOME WORKER FUNCTIONS */

/**
 * A helper function to send that api worker is initialized successfully
 */
function apiWorkerInitializedHome() {
    try {
        self.postMessage({
            name: 'api-worker-initialized-home',
            payload: {},
        });
    } catch (err) {
        sendErrorMessage('apiWorkerInitializedHome', err)
    }
}

/**
 * Send to API to get the lithium hood and user
 */
async function getLithiumHood() {
    try {
        const response = await axios.get(`${apiUrl}/lithiumHood/get_lithium_hood`, {
            headers: {
                Token: token,
            },
        });
        self.postMessage({
            name: 'received-lithium-hood',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('loadMessagesFromServer', err)
    }
}

/**
 * Send to API to get the lithium rooms for user
 */
async function getLithiumRooms() {
    try {
        const response = await axios.get(`${apiUrl}/chatRoom/get_chat_rooms`, {
            headers: {
                Token: token,
            },
        });
        self.postMessage({
            name: 'received-lithium-rooms',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('loadLithiumRoomsFromServer', err)
    }
}

/**
 * Tells Api to create new lithium room
 * @param params
 * @returns {Promise<void>}
 */
async function createLithiumRoom(params) {
    try {
        const response = await axiosClient.post(`${apiUrl}/chatRoom/create_group_lithium_room`, {
            name: params.newLithiumRoomName,
        }, {
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'created-lithium-room',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Tells Api to get lithium hood
 * @returns {Promise<void>}
 */
async function getLithiumHoodMembers() {
    try {
        const response = await axiosClient.get(`${apiUrl}/lithiumHoodMember/get_lithium_hood_members`,  {
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'received-lithium-hood-members',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Tells Api to create send lithium hood request
 * @param params
 * @returns {Promise<void>}
 */
async function sendLithiumHoodRequest(params) {
    try {
        const response = await axiosClient.post(`${apiUrl}/lithiumHoodRequest/send_hood_request`, {
            username: params.username,
        }, {
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'sent-lithium-hood-request',
            payload: {
                username: params.username,
            },
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Tells Api to get lithium hood requests
 * @returns {Promise<void>}
 */
async function getLithiumHoodRequests() {
    try {
        const response = await axiosClient.get(`${apiUrl}/lithiumHoodRequest/get_hood_requests`,  {
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'received-lithium-hood-requests',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Tells Api to accept lithium hood request
 * @returns {Promise<void>}
 */
async function acceptLithiumHoodRequests(params) {
    try {
        const response = await axiosClient.post(`${apiUrl}/lithiumHoodRequest/${params.lithiumHoodRequestId}/accept_hood_request`,{},{
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'accepted-lithium-hood-request',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Tells Api to decline lithium hood request
 * @returns {Promise<void>}
 */
async function declineLithiumHoodRequests(params) {
    try {
        const response = await axiosClient.post(`${apiUrl}/lithiumHoodRequest/${params.lithiumHoodRequestId}/decline_hood_request`,{},{
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'declined-lithium-hood-request',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Tells Api to remove user from lithium hood
 * @returns {Promise<void>}
 */
async function removingLithiumHoodMember(params) {
    try {
        const response = await axiosClient.post(`${apiUrl}/lithiumHoodMember/remove_user_from_hood`,{
            removedUserUsername: params.username
        },{
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'removed-lithium-hood-member',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Tells Api to send lithium
 * @returns {Promise<void>}
 */
async function sendingLithium(params) {
    try {
        const response = await axiosClient.post(`${apiUrl}/lithiumSent/send_lithium`,{
            username: params.username,
            lithiumHood_id: params.lithiumHood_id,
        },{
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'sent-lithium',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Tells Api to get unseen lithiums
 * @returns {Promise<void>}
 */
async function gettingCountOfUnseenLithiums() {
    try {
        const response = await axiosClient.get(`${apiUrl}/lithiumSent/get_count_of_unseen_lithiums`,{
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'get-count-of-unseen-lithiums',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Tells Api to get unseen lithiums
 * @returns {Promise<void>}
 */
async function gettingUnseenLithiums() {
    try {
        const response = await axiosClient.get(`${apiUrl}/lithiumSent/get_lithiums`,{
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });
        self.postMessage({
            name: 'get-unseen-lithiums',
            payload: response.data,
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/**
 * Tells Api to seen lithiums
 * @returns {Promise<void>}
 */
async function seeingAllLithiums() {
    try {
        await axiosClient.post(`${apiUrl}/lithiumSent/see_all_lithiums`, {

        },{
            headers: {
                Token: token,
                ClientId: clientId,
            },
        });

        self.postMessage({
            name: 'seen-all-lithiums',
        });
    } catch (err) {
        sendErrorMessage('sendMessage', err)
    }
}

/* LITHIUM ROOM WORKER FUNCTIONS */
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
    /* LITHIUM SPACE FUNCTIONS */
    if (taskName === 'init-home') {
        clientId = taskPayload.clientId;
        token = taskPayload.token;
        await queue.add(async () => {
            await apiWorkerInitializedHome();
        });
    } else if (taskName === 'getting-lithium-hood') {
        await queue.add(async () => {
            await getLithiumHood();
        });
    } else if (taskName === 'getting-lithium-rooms') {
        await queue.add(async () => {
            await getLithiumRooms();
        });
    } else if (taskName === 'creating-lithium-room') {
        await queue.add(async () => {
            await createLithiumRoom(taskPayload);
        });
    } else if (taskName === 'getting-lithium-hood-members') {
        await queue.add(async () => {
            await getLithiumHoodMembers();
        });
    } else if (taskName === 'getting-lithium-hood-requests') {
        await queue.add(async () => {
            await getLithiumHoodRequests();
        });
    } else if (taskName === 'sending-lithium-hood-request') {
        await queue.add(async () => {
            await sendLithiumHoodRequest(taskPayload);
        });
    } else if (taskName === 'accepting-lithium-hood-request') {
        await queue.add(async () => {
            await acceptLithiumHoodRequests(taskPayload);
        });
    } else if (taskName === 'declining-lithium-hood-request') {
        await queue.add(async () => {
            await declineLithiumHoodRequests(taskPayload);
        });
    } else if (taskName === 'removing-lithium-hood-member') {
        await queue.add(async () => {
            await removingLithiumHoodMember(taskPayload);
        });
    } else if (taskName === 'sending-lithium') {
        await queue.add(async () => {
            await sendingLithium(taskPayload);
        });
    } else if (taskName === 'getting-unseen-lithiums') {
        await queue.add(async () => {
            await gettingUnseenLithiums();
        });
    } else if (taskName === 'seeing-all-lithiums') {
        await queue.add(async () => {
            await seeingAllLithiums();
        });
    } else if (taskName === 'getting-count-of-unseen-lithiums') {
        await queue.add(async () => {
            await gettingCountOfUnseenLithiums();
        });
        /* LITHIUM ROOM FUNCTIONS */
    } else if (taskName === 'init') {
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