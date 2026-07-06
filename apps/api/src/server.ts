import http from 'http';
import app, { BASE_URL } from "./app.js";

const server = http.createServer(app);

export { server, BASE_URL };
