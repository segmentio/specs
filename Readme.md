
# Specs

Specs is a high level dashboard for viewing your [ECS][ecs] clusters. Specs can quickly show you:

  - the services a given cluster is running
  - the desired count of a given service
  - the tagged docker image running
  - the most recent events of a service

![](http://i.imgur.com/4QUvXTr.png)

We built Specs to work around the sluggishness of the internal AWS dashboard. It allows for quick searching, and doesn't require paging through results.


## Docker

It's easiest to run Specs with docker. Assuming you have your AWS credentials exported, simply run the container like this:

    $ docker run \
      -e "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" \
      -e "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" \
      -e "AWS_REGION=$AWS_REGION" \
      -e "AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN" \
      -p 3000:3000 \
      segment/specs


## Development

In one terminal window, do:

    $ aws-vault exec <env> -- make server


In another, do:

    $ make dev-server


Now visit [http://localhost:3001/](http://localhost:3001/) =)

[ecs]: https://aws.amazon.com/ecs/
