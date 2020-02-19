declare module 'workerize-loader*' {
  class WebpackWorker extends Worker {
    constructor();
  }

  export = WebpackWorker;
}
