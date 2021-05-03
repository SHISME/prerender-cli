/** @format */
import { writeFile } from 'fs';
import { promisify } from 'util';

export default async function savePreRenderHTML(
  path: string,
  html: string,
): Promise<void> {
  await promisify(writeFile)(path, html);
}
