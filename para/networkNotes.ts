// export interface NetworkMessage {
//   id: string
//   bin: Uint8Array
// }

// export interface NetworkClient {
//   init: (onMessage: (m: NetworkMessage) => void) => void
//   sendMessage: (m: NetworkMessage) => Promise<boolean>
// }

// export const buildBroadcastChannelNetwork = (name: string): NetworkClient => {
//   const bc = new BroadcastChannel(name)

//   return {
//     init(onMessage) {
//       bc.onmessage = (messageEvent) => {
//         const message = messageEvent.data as NetworkMessage
//         onMessage(message)
//       }
//     },
//     async sendMessage(m) {
//       bc.postMessage(m)
//       return true
//     },
//   }
// }
