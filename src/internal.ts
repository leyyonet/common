import { packageJson } from "./sys/index.js";

export const { name: NME, fqn: FQN, version: VER } = packageJson(import.meta.url);
