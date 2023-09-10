import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { createRouter } from '@internal/plugin-example-form-catalog-backend';

export default async function createPlugin(
    env: PluginEnvironment,
): Promise<Router> {
    return await createRouter(
        {
            logger: env.logger,
        }
    );
}

