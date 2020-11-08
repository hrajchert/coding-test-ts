import { App } from './app';

new App()
  // run the app
  .run()
  // and check for errors
  .catch(err => console.error(`There was a problem ${err}`));
