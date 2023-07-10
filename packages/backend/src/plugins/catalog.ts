import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {GitlabFillerProcessor} from "@immobiliarelabs/backstage-plugin-gitlab-backend";

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  builder.addProcessor(new GitlabFillerProcessor(env.config));
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
