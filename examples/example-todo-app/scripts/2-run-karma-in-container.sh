docker run --rm --name karma -v /var/run/docker.sock:/var/run/docker.sock -v $(dirname $(realpath $0))/..:/app -w /app -p 9876:9876 node npm run test
