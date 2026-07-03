import http from 'http';
import app, { BASE_URL } from "./app";

const server = http.createServer(app);

export { server, BASE_URL };
