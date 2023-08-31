/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */
import express from 'express';
import Router from 'express-promise-router';
import {
  createServiceBuilder,
  loadBackendConfig,
  getRootLogger,
  useHotMemoize,
  notFoundHandler,
  CacheManager,
  DatabaseManager,
  HostDiscovery,
  UrlReaders,
  ServerTokenManager,
} from '@backstage/backend-common';
import { TaskScheduler } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import healthcheck from './plugins/healthcheck';
import app from './plugins/app';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import techdocs from './plugins/techdocs';
import search from './plugins/search';
import gitlab from './plugins/gitlab';
import { PluginEnvironment } from './types';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
import formData from './plugins/formData';
import { DocumentBuilder } from 'express-openapi-generator';
import openapispec from './plugins/openapispec';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = HostDiscovery.fromConfig(config);
  const cacheManager = CacheManager.fromConfig(config);
  const databaseManager = DatabaseManager.fromConfig(config, { logger: root });
  const tokenManager = ServerTokenManager.noop();
  const taskScheduler = TaskScheduler.fromConfig(config);

  const identity = DefaultIdentityClient.create({
    discovery,
  });
  const permissions = ServerPermissionClient.fromConfig(config, {
    discovery,
    tokenManager,
  });

  root.info(`Created UrlReader ${reader}`);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
    const cache = cacheManager.forPlugin(plugin);
    const scheduler = taskScheduler.forPlugin(plugin);
    return {
      logger,
      database,
      cache,
      config,
      reader,
      discovery,
      tokenManager,
      scheduler,
      permissions,
      identity,
    };
  };
}

async function main() {
  const config = await loadBackendConfig({
    argv: process.argv,
    logger: getRootLogger(),
  });
  const createEnv = makeCreateEnv(config);

  const healthcheckEnv = useHotMemoize(module, () => createEnv('healthcheck'));
  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, () => createEnv('auth'));
  const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
  const searchEnv = useHotMemoize(module, () => createEnv('search'));
  const appEnv = useHotMemoize(module, () => createEnv('app'));
  const gitlabEnv = useHotMemoize(module, () => createEnv('gitlab'));
  const formDataEnv = useHotMemoize(module, () => createEnv('form-data')); // for custom dynamic form
  const openapispecEnv = useHotMemoize(module, () => createEnv('openapispec'));

  const baseapp = express();
  const apiRouter = Router();
  baseapp.use(express.json());
  async function makeRoute(router: express.Router) {
    router.use('/catalog', await catalog(catalogEnv));
    router.use('/scaffolder', await scaffolder(scaffolderEnv));
    router.use('/auth', await auth(authEnv));
    router.use('/techdocs', await techdocs(techdocsEnv));
    router.use('/proxy', await proxy(proxyEnv));
    router.use('/search', await search(searchEnv));
    router.use('/gitlab', await gitlab(gitlabEnv));
    router.use('/form-data', await formData(formDataEnv)); // for custom dynamic form
    return router;
  } // Generates our full open api document

  // This initializes and creates our document builder interface
  const documentBuilder = DocumentBuilder.initializeDocument({
    openapi: '3.0.1',
    info: {
      title: 'A example document',
      version: '1',
    },
    paths: {}, // You don't need to include any path objects, those will be generated later
  });
  try {
    // const router = await makeRoute(apiRouter);
    baseapp.use(await makeRoute(apiRouter));
    console.log(baseapp._router.stack[3].handle);
    documentBuilder.generatePathsObject(baseapp);
    apiRouter.use(
      '/openapispec',
      await openapispec(openapispecEnv, documentBuilder.build()),
    );
  } catch (e) {
    console.error('Error setting up routes:', e);
  }

  // Add backends ABOVE this line; this 404 handler is the catch-all fallback
  apiRouter.use(notFoundHandler());

  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('', await healthcheck(healthcheckEnv))
    .addRouter('/api', apiRouter)
    .addRouter('', await app(appEnv));

  await service
    .start()
    .then()
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
}

if (module.hot) {
  module.hot.accept();
}

main().catch(error => {
  console.error('Backend failed to start up', error);
  process.exit(1);
});
