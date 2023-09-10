import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { writeFile } from 'fs';
import { createGradle } from './gradle';

export const createNewFileAction = () => {
  return createTemplateAction<{ contents: string; filename: string }>({
    id: 'builtin:create:file',
    schema: {
      input: {
        required: ['filename', 'contents'],
        type: 'object',
        properties: {
          filename: {
            title: 'File Name',
            type: 'string',
            description: 'name of file',
          },
          contents: {
            title: 'file contents',
            type: 'string',
            description: 'content',
          },
        },
      },
    },
    async handler(ctx) {
      const { signal } = ctx;
      await writeFile(
        `${ctx.workspacePath}/${ctx.input.filename}`,
        ctx.input.contents,
        { signal },
        _ => {},
      );
    },
  });
};

export const createDependencyAction = () => {
  return createTemplateAction<{ dependencies: any }>({
    id: 'create:dependency:gradle',
    schema: {
      input: {
        required: ['dependencies'],
        type: 'object',
        properties: {
          dependencies: {
            title: 'Dependencies',
            type: 'array',
            description: 'array of dependencies',
            items: {
              type: 'object',
              properties: {
                type: {
                  title: 'type',
                  type: 'string',
                  description:
                    'ex) implementation, runtimeOnly, testImplementation',
                },
                dependency: {
                  title: 'dependency-name',
                  type: 'string',
                  description:
                    'ex) org.springframework.boot:spring-boot-starter-cache',
                },
                version: {
                  title: 'version',
                  type: 'string',
                  description: 'version',
                },
              },
            },
          },
        },
      },
    },
    async handler(ctx) {
      await writeFile(
        `${ctx.workspacePath}/build.gradle`,
        createGradle(ctx.input.dependencies),
        _ => {},
      );
    },
  });
};
