
type StreamablePromiseExecutor<T, S> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void,
  stream: (stream: S) => void
) => void;

export class StreamablePromise<T = any, S = any> {
  private readonly _streamHandler: ((stream: S) => void)[] = [];
  private readonly _promise: Promise<T>;

  constructor(executor: StreamablePromiseExecutor<T, S>) {
    this._promise = new Promise<T>(async (res, rej) => {
      const sendStream = (stream: S) => {
        this._streamHandler.forEach((e) => {
          try {
            e(stream);
          } catch (e) {
            console.error('Failed to handle stream');
            console.error(e);
          }
        });
      };

      await Promise.resolve(executor(res, rej, sendStream));
    });
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ) {
    this._promise.then(onfulfilled, onrejected);
    return this;
  }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null) {
    this._promise.catch(onrejected);
    return this;
  }

  finally(onfinally?: (() => void) | undefined | null) {
    this._promise.finally(onfinally);
    return this;
  }
  
  onStream(handler: (stream: S) => void) {
    this._streamHandler.push(handler);
    return this;
  }
}
