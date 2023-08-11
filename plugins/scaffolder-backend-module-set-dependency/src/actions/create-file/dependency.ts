import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import {writeFile} from "fs";

/**
 * create a new action that allows to generate dependency setting file when a new component is created.
 *
 * @public
 */
export function createDependencyFileAction() {
  return createTemplateAction<{ contents: string; filename: string }>(
      {
        id: 'create:dependency',
        schema: {
          input: {
            required: ['filename','contents'],
            type: 'object',
            properties: {
              filename: {
                title: 'File Name',
                type: 'string',
                description: 'name of file'
              },
              contents: {
                title: 'file contents',
                type: 'string',
                description: 'content'
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
}
