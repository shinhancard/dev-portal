import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/teams', (_, response) => {
    logger.info('[RESP] example shcard teams');

    // Example form data
    response.json(['신기술지원팀', '플랫폼개발팀', '코어개발팀', '플랫폼인프라팀', '코어인프라팀']);
  });
  router.use(errorHandler());
  return router;
}
