import express from 'express';
import Router from 'express-promise-router';

export async function scaffolderRouter(): Promise<express.Router> {
  const router = Router();

  // TODO: Dependencies Type list -> nexus에서 목록을 받아오든 DB에서 읽어오든 수정 필요
  router.get('/get/dependency/type', async (_, response) => {
    response.json(['implementation', 'runtimeOnly', 'testImplementation']);
  });

  router.get('/get/dependency/name', async (_, response) => {
    response.json([
      'core',
      'network-starter',
      'oai-starter',
      'oauth-server-starter',
      'core-crypto',
    ]);
  });

  router.get('/get/dependency/version', async (_, response) => {
    response.json(['0.0.1', '1.0.0', '1.1.0', '2.0.0', '2.0.1']);
  });

  return router;
}
