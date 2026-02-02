import type { GlobalSetupContext } from "vitest/node";

import { startNextServer, stopNextServer } from "./helpers/next-server";

declare module "vitest" {
  type ProvidedContext = {
    baseUrl: string;
  };
}

export default async function globalSetup({ provide }: GlobalSetupContext) {
  const { baseUrl } = await startNextServer();
  provide("baseUrl", baseUrl);

  return async () => {
    await stopNextServer();
  };
}
