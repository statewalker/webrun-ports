import ioHandle from './ioHandle.js';
import listenPort from './listenPort.js';

/**
 * Listens for entering requests and delegates calls to the given method
 * to handle input streams; the resulting stream of values is retuned by 
 * the handler method is returned to the caller over the same port.
 *
 * This method is used as the server part, recieving and handling
 * requests sent by the `callBidi` method.
 *
 * @param {MessagePort} port - The port number to listen on.
 * @param {function} action - The `AsyncGenerator` instance recieving 
 * an `AsyncIterator` with input values and yielding a stream of restuls
 * returned to the caller
 * @param {function} accept - The function allowing to accept/reject
 * the initial call based on recieved parameters.
 * @returns {function} A callback method allowing to remove the registered
 * call handler.
 */
export default function listenBidi(port, action, accept = () => true) {
  return listenPort(port, async (params) => {
    if (!params.channelName) return;
    if (!accept(params)) return;
    for await (const _idx of ioHandle(port, (input) => action(input, params), params)) {
      _idx;
      break;
    }
  });
}
