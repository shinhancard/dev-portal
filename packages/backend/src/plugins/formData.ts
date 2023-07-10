import { createRouter } from '@premise/plugin-form-data-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { exampleRouter } from '../providers/exampleRouter';
import {scaffolderRouter} from "../providers/scaffolderRouter";

export default async function createPlugin(
    env: PluginEnvironment,
): Promise<Router> {
    return await createRouter(
        {
            logger: env.logger,
        },
        [
            {
                path: '/example',
                router: exampleRouter,
            }
            ,
            {
                path: '/scaffolder',
                router: scaffolderRouter,
            }
        ],
    );
}
