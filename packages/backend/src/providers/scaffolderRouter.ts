import express from 'express';
import Router from 'express-promise-router';
import { RouterOptions } from '@premise/plugin-form-data-backend';

export async function scaffolderRouter(
    options: RouterOptions,
): Promise<express.Router> {
    const { logger } = options;
    const router = Router();

    router.get('/get/dependency/type', async (_, response) => {
        logger.info('Dependencies Type list -> nexus에서 목록을 받아오든 DB에서 읽어오든 수정 필요');
        response.json(['implementation', 'runtimeOnly', 'testImplementation']);
    });

    router.get('/get/dependency/name', async (_, response) => {
        logger.info('Dependencies Name list -> nexus에서 목록을 받아오든 DB에서 읽어오든 수정 필요');
        response.json(['core', 'network-starter', 'oai-starter', 'oauth-server-starter', 'core-crypto']);
    });

    router.get('/get/dependency/version', async (_, response) => {
        logger.info('Dependencies Version list -> nexus에서 목록을 받아오든 DB에서 읽어오든 수정 필요');
        response.json(['0.0.1', '1.0.0', '1.1.0', '2.0.0', '2.0.1']);
    });

    return router;
}
