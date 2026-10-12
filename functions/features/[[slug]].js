import { serveCms } from "../../src/lib/pages-cms-handler.mjs";
export const onRequest = (context) => serveCms(context, false);
