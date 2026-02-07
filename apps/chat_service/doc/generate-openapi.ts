import { openapiSpec } from "./swagger-config";
import fs from 'node:fs';

fs.writeFileSync('./doc/openapi.json', JSON.stringify(openapiSpec, null, 2));