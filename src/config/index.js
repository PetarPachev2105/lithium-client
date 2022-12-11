const isProduction = true;

let API_URL = 'http://localhost:5000/api';
let WEBSOCKET_URL = 'ws://localhost:5001';

if (isProduction) {
    API_URL = 'https://api.lithiumawesome.com/api';
    WEBSOCKET_URL = 'ws://ec2-3-73-50-42.eu-central-1.compute.amazonaws.com';
}

export default {
    API_URL,
    WEBSOCKET_URL,
};