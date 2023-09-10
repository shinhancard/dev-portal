import { createRouter } from '@internal/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({

    discovery: env.discovery,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    identity: env.identity,
    permissions: env.permissions,
  });
}
