import { createAppAuth } from '@octokit/auth-app';
import { writeFileSync } from 'fs';

const appId = process.env.APP_ID;
const installationId = process.env.INSTALLATION_ID;
const privateKey = process.env.APP_PRIVATE_KEY;

if (!appId || !installationId || !privateKey) {
  console.error('Missing env: APP_ID, INSTALLATION_ID, APP_PRIVATE_KEY');
  process.exit(1);
}

const auth = createAppAuth({ appId, privateKey, installationId });
const { token } = await auth({ type: 'installation' });

const out = process.argv[2] || '/workspace/gh_token.txt';
writeFileSync(out, token, { mode: 0o600 });
console.log(`Installation access token minted (expires in 1h) → ${out}`);
