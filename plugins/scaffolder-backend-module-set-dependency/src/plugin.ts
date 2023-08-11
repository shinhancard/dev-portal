import{
    createBackendPlugin,
    coreServices
} from '@backstage/backend-plugin-api'
import {rootRouteRef} from "@backstage/plugin-home/src/routes";

export const setDependencyPlugin = createBackendPlugin({
    pluginId: 'set-dependency',
    register(env) {
        env.registerInit({
            deps: {
                // Declare dependencies to services that you want to consume
                logger: coreServices.logger,
                httpRouter: coreServices.httpRouter,
            },
            async init({
                           logger,
                           httpRouter,
                       }) {
                logger.info('Hello from example plugin');
                httpRouter.use(rootRouteRef);
            },
        });
    },
});
