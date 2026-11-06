import * as api from '@lp-labs/security-txt-codec';
import { parseSecurityTxt } from '@lp-labs/security-txt-codec';
const fields = parseSecurityTxt(
  'Contact: mailto:security@example.com\nExpires: 2030-01-01T00:00:00Z',
);
if (fields.Contact[0] !== 'mailto:security@example.com') throw new Error('Contact missing');
// @ts-expect-error invalid argument must be rejected by declarations
api.parseSecurityTxt(4);
