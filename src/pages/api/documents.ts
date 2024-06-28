import type { NextApiRequest, NextApiResponse } from 'next';

import * as path from 'path';
import * as fs from 'fs';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { type } = req.query as { type: string };

  const locales = [
    'title',
    'block-name',
    'device-brand',
    'device-capacity',
    'device-mode',
    'device-type',
    'materials',
    'place-floor',
    'place-room',
  ];
  if (!type || !locales.find(i => i === type)) {
    res.status(422).json({ type: `invalid, only: ${locales}` });
    return;
  }

  const locale = path.resolve(
    'src',
    'database',
    'documents',
    `${locales.find(i => i === type)}.json`,
  );
  const data = JSON.parse(fs.readFileSync(locale, { encoding: 'utf-8' }));

  if (req.method === 'GET') {
    res.status(200).json(data);
    return;
  }

  if (!req.body.name) {
    res.status(422).json({ name: 'obrigatório' });
    return;
  }

  const updatedData = [...data, req.body];

  fs.writeFileSync(locale, JSON.stringify(updatedData));

  res.status(200).json(updatedData);
};
