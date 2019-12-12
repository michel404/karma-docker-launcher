# Running a docker deamen inside a docker container is not recommended, as pointed out in e.g.
# this blog post: https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/.
#
# It is possible using the commands below.
#
# Don't forget to edit karma.conf to set the following modem options:
# ```
#        modemOptions: {
#          host: 'localhost',
#          port: '2375'
#        },
# ```

docker run --rm --privileged -d -p 2375:2375 -v $(dirname $(realpath $0))/..:/app --name dind --entrypoint dockerd docker:dind -H 0.0.0.0:2375
docker -H localhost:2375 run --network host -v /app:/app -w /app node npm run test
docker stop dind
