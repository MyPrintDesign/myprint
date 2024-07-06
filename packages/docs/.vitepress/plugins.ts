import path from 'path';
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import tableWrapper from './plugins/table-wrapper';
import type Token from 'markdown-it/lib/token';
import type Renderer from 'markdown-it/lib/renderer';

// const localMd = MarkdownIt().use(tag)

//@ts-ignore
export const mdPlugin = (md: MarkdownIt) => {
    md.use(tableWrapper);
};
