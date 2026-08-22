// `/demo` and `/test` are the same page under two names. This import points at a sibling inside the
// group, so it did not gain a hop the way the imports that leave the group did.
export { metadata, default } from '../test/page';
