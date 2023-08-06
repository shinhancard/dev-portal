import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { writeFile } from 'fs';

export const createNewFileAction = () => {
    return createTemplateAction<{ contents: string; filename: string }>(
        {
        id: 'builtin:create:file',
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
};
