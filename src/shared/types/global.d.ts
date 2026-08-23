declare const __APP_VERSION__: string;

declare module "*?worker" {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
