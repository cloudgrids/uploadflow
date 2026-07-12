import type { ExtensionMessage } from '../types/Message';

export class MessageService {
  public send<TResponse>(message: ExtensionMessage): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response: TResponse) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(new Error(error.message));
          return;
        }
        resolve(response);
      });
    });
  }
}
