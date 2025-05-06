import type { auth } from '../lib/auth.lib';

export type TypedUser = typeof auth.$Infer.Session.user;
export type TypedSession = typeof auth.$Infer.Session.session;