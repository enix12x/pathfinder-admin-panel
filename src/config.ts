import * as fs from 'fs';
import * as TOML from '@iarna/toml';

export interface Config {
  server: {
    port: number;
  };
  authServerUrl: string;
  pathfinderUrl: string;
  apiSecret: string;
}

export function loadConfig(): Config {
  const configPath = process.cwd() + '/config.toml';
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const parsed = TOML.parse(configContent) as any;
  return {
    server: {
      port: parsed.server.port
    },
    authServerUrl: parsed.authServerUrl || 'http://localhost:4001',
    pathfinderUrl: parsed.pathfinderUrl || 'http://localhost:3000',
    apiSecret: parsed.apiSecret || 'YOUR_SECRET'
  };
}
