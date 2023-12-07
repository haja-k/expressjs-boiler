#!/bin/sh

echo "Building bleeding backend image"
npm install 
npm install -g nodemon
npm run go &


# Check if the server is up before proceeding
while ! curl -s http://localhost:3000 > /dev/null; do
    echo "Waiting for the server to start..."
    sleep 5
done

echo "Server is up and running! Proceeding to the next pipeline stage."
