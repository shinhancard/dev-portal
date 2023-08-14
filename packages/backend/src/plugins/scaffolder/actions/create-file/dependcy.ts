import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { writeFile } from 'fs';
import {createGradle} from "./gradle";

export const createDependencyAction = () => {
    return createTemplateAction<{ dependencies }>(
        {
            id: 'create:dependency:gradle',
            schema: {
                input: {
                    required: ['dependencies'],
                    type: 'array',
                    properties: {
                        dependencies: {
                            title: 'Dependencies',
                            type: 'object',
                            description: 'array of dependencies',
                            items: {
                                type: {
                                    title: 'type',
                                    type: 'string',
                                    description: 'ex) implementation, runtimeOnly, testImplementation'
                                },
                                dependency:{
                                    title: 'dependency-name',
                                    type: 'string',
                                    description: 'ex) org.springframework.boot:spring-boot-starter-cache'
                                },
                                version: {
                                    title: 'version',
                                    type: 'string',
                                    description: 'version'
                                }

                            }
                        }
                    }
                }
            },
            async handler(ctx) {
                const { signal } = ctx;
                console.log(ctx.input.dependencies);
                await writeFile(
                    `${ctx.workspacePath}/build.gradle`,
                    createGradle(ctx.input.dependencies),
                    _ => {},
                );
            },
        });
};
