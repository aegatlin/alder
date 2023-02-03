import EventEmitter from 'eventemitter3'

export const Global = {
  broadcastChannel: new BroadcastChannel('global'),
  eventEmitter: new EventEmitter(),
  broadcastUpdated() {
    Global.broadcastChannel.postMessage('updated')
  },
}

Global.broadcastChannel.onmessage = (message) => {
  console.log('global broadcast received!', message)
  if (message.data === 'updated') {
    Global.eventEmitter.emit('updated')
  }
}
