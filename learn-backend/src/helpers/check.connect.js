'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

// This function counts the number of active connections to the MongoDB db
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of active connections: ${numConnections}`);
    return numConnections;
}

// This function checks if the number of connections exceeds a certain limit
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections = numCores * 2;

        console.log(`Active Connections: ${numConnections}`);
        console.log(`Memory Usage: ${Math.round(memoryUsage / 1024 / 1024)} MB`);

        if( numConnections > maxConnections ) {
            console.log(`Connection limit exceeded: ${numConnections} > ${maxConnections}`);
            // notify.send(....)
        }

    }, _SECONDS) // Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}