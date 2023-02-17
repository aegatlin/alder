# alder

## Setup

This app uses Upstash Redis.

To setup local redis for local dev and testing, on macos:

```sh
brew install redis
# This next comment is automatic, but in case something goes wrong...
# brew services start redis
echo "REDIS_CONNECTION_STRING=redis://localhost:6379">>./.env
```

## Captain's Log

### Para

- (02/23) I removed id generation from `para.docs.create` because I began to doubt the legitimacy of taking away that control from the user.