import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import {
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  UrlReader,
} from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { createDependencyAction } from "../generate/dependency/dependency";
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { CatalogClient } from '@backstage/catalog-client';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';

export interface RouterOptions {
  logger: Logger;
  config: Config;
  discovery: PluginEndpointDiscovery;
  database: PluginDatabaseManager;
  identity: IdentityApi;
  reader: UrlReader;
  permissions: PermissionEvaluator;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, discovery, reader } = options;

  const catalogClient = new CatalogClient({
    discoveryApi: discovery,
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: config,
    reader: reader,
  })
  const actions = [...builtInActions, createDependencyAction()];

  // return await createRouter({
  //   actions,
  //   logger: logger,
  //   config: config,
  //   reader: reader,
  // });

  const router = Router();
  router.use(express.json());

  // TODO: Dependencies Type list -> nexus에서 목록을 받아오든 DB에서 읽어오든 수정 필요
  router.get('/get/dependency/type', async (_, response) => {
    logger.info('GET /get/dependency/type');
    response.json(['implementation', 'runtimeOnly', 'testImplementation']);
  });

  router.get('/get/dependency/name', async (_, response) => {
    logger.info('GET /get/dependency/name');
    response.json([
      'core',
      'network-starter',
      'oai-starter',
      'oauth-server-starter',
      'core-crypto',
    ]);
  });

  router.get('/get/dependency/version', async (_, response) => {
    logger.info('GET /get/dependency/version');
    response.json(['0.0.1', '1.0.0', '1.1.0', '2.0.0', '2.0.1']);
  });
  router.use(errorHandler());
  return router;

}
