import type { auth } from 'shared/lib/auth.lib';

export type TypedUser = typeof auth.$Infer.Session.user;
export type TypedSession = typeof auth.$Infer.Session.session;