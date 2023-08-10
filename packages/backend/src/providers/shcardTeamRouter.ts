import express from 'express';
import Router from 'express-promise-router';
import { RouterOptions } from '@premise/plugin-form-data-backend';

export async function shcardTeamRouter(
    options: RouterOptions,
): Promise<express.Router> {
    const { logger } = options;
    const router = Router();

    router.get('/teams', async (_, response) => {
        logger.info('shcard teams');
        response.json(['신기술지원팀', '플랫폼개발팀', '코어개발팀', '플랫폼인프라팀', '코어인프라팀']);
    });

    return router;
}