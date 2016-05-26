
# Specs

Specs is a high level dashboard for viewing your [ECS][ecs] clusters. Specs can quickly show you:

  - the services a given cluster is running
  - the desired count of a given service
  - the tagged docker image running
  - the most recent events of a service

![](http://i.imgur.com/4QUvXTr.png)

We built Specs to work around the sluggishness of the internal AWS dashboard. It allows for quick searching, and doesn't require paging through results. And if you run it internally, your teammates won't need any separate IAM users or permissions.

## Docker

It's easiest to run Specs with docker. Assuming you have your AWS credentials exported, simply run the container like this:

    $ docker run \
      -e "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" \
      -e "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" \
      -e "AWS_REGION=$AWS_REGION" \
      -e "AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN" \
      -p 3000:3000 \
      segment/specs

## IAM Permissions

In order to run Specs, you'll need to create an IAM user or role with the following permissions:

    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": [
            "ecs:Describe*",
            "ecs:DiscoverPollEndpoint",
            "ecs:List*",
            "ecs:Poll"
          ],
          "Effect": "Allow",
          "Resource": "*"
        }
      ]
    }

Then you should be off to the races.

## Development

To develop, you'll first need to install [node][node]. Then, you can run the server and client builders, both of which will watch for changes and hot-reload.

In one terminal window (which has your AWS credentials exported), run the following:

    $ make server

In another, do:

    $ make dev-server


Now visit [http://localhost:3001/](http://localhost:3001/) =)

[ecs]: https://aws.amazon.com/ecs/
[node]: https://nodejs.org/en/

## License

Released under the MIT License

(The MIT License)

Copyright (c) 2016 Segment <friends@segment.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.