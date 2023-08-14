import { CatalogClient } from '@backstage/catalog-client';
import {createBuiltinActions, createRouter} from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../../types';
import { ScmIntegrations } from '@backstage/integration';
import {createNewFileAction} from "./actions/create-file";
import {createDependencyAction} from "./actions/create-file/dependcy";

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
  const integrations = ScmIntegrations.fromConfig(env.config);
  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  })

  const actions = [...builtInActions, createDependencyAction()];

  return await createRouter({
    catalogClient,
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    identity: env.identity,
    permissions: env.permissions,
  });
}
