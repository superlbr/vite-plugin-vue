import path from 'node:path';
import crypto from 'node:crypto';
import process from 'node:process';

const hashMap: Record<string, string> = {};

function getUniqueName(content: string, p: string): string {
  const hash = crypto.createHash('md5');
  hash.update(content);
  const hashText = hash.digest('hex').substring(0, 5);

  // new
  if (!hashMap[hashText]) {
    hashMap[hashText] = p;
    return hashText;
  }

  // self
  if (hashMap[hashText] === p)
    return hashText;

  // repeated
  return getUniqueName(`${content}~`, p);
}

export function createClassNamehash(args: {
  root: string;
  name: string;
  filename: string;
  prefix: string;
  classCompress?: boolean;
}) {
  const { root, name, filename, prefix, classCompress = true } = args;
  const p = `${path.relative(root, filename).replace(/\\/g, '/')}--${name}`;
  const basename = path
    .basename(filename)
    .replace(/(\.module)?\.(css|less|scss)/, '')
    .replace(/\./g, '_');
  const dirname = path.basename(path.dirname(filename));

  const content = `${prefix}:${p}`;
  const hash = getUniqueName(content, p);

  const cls
    = process.env.NODE_ENV === 'development' || !classCompress
      ? `${dirname}_${basename}_${name}__${hash}`
      : `${hash}`;

  return prefix ? `${prefix}${cls}` : cls;
}
