# @lp-labs/security-txt-codec

RFC 9116-style security.txt parser and formatter for Contact and Expires fields.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/security-txt-codec
```

## Working example

```js
import { parseSecurityTxt } from '@lp-labs/security-txt-codec';
const fields = parseSecurityTxt(
  'Contact: mailto:security@example.com\nExpires: 2030-01-01T00:00:00Z',
);
if (fields.Contact[0] !== 'mailto:security@example.com') throw new Error('Contact missing');
```

CommonJS: `const api = require('@lp-labs/security-txt-codec')`.

## Behavior, customization and limits

Parses case-insensitive key/value lines, repeated fields and comments, requiring at least one Contact and one UTC Expires timestamp. It does not fetch, validate contact reachability, check expiry against a clock, or provide security-program advice.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export type SecurityFields = Readonly<Record<string, readonly string[]>>;
export declare function parseSecurityTxt(text: string): SecurityFields;
export declare function formatSecurityTxt(fields: SecurityFields): string;
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
