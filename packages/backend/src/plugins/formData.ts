import { createRouter } from '@premise/plugin-form-data-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { shcardTeamRouter } from '../providers/shcardTeamRouter';

export default async function createPlugin(
    env: PluginEnvironment,
): Promise<Router> {
    return await createRouter(
        {
            logger: env.logger,
        },
        [
            {
                path: '/shcard',
                router: shcardTeamRouter,
            }
        ],
    );
}