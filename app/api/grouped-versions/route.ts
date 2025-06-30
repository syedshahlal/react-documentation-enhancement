// app/api/versions/route.ts
export const runtime = 'nodejs';
export const revalidate = 3600;

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import semver from 'semver';

const DOCS_DIR = path.join(process.cwd(), 'docs');
const VERSIONS_JSON = path.join(process.cwd(), 'app/api/versions/versions.json');
const VALID_STATUSES = new Set(['current', 'development', 'future', 'previous']);

export async function GET() {
  try {
    const docDirs = (await fs.readdir(DOCS_DIR))
      .filter((d) => /^gcp-\d+(?:\.\d+)?$/.test(d));

    const versionsMeta: {
      version: string;
      releaseDate: string;
      status: string;
    }[] = JSON.parse(await fs.readFile(VERSIONS_JSON, 'utf8'));

    const filtered = versionsMeta.filter(
      (v) => docDirs.includes(v.version) && VALID_STATUSES.has(v.status),
    );

    const byStatus = (status: string) =>
      filtered
        .filter((v) => v.status === status)
        .sort((a, b) =>
          semver.rcompare(a.version.replace('gcp-', ''), b.version.replace('gcp-', '')),
        );

    const grouped = {
      current: byStatus('current'),
      development: byStatus('development'),
      future: byStatus('future'),
      previous: byStatus('previous'),
    };

    return NextResponse.json({ latest: grouped.current[0] ?? grouped.development[0], ...grouped });
  } catch (err) {
    console.error('Version API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
