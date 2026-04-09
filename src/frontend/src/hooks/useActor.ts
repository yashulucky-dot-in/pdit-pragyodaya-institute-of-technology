// Shim: bridges old `../hooks/useActor` imports to the current
// @caffeineai/core-infrastructure package API.
//
// The package's useActor expects a createActor function as its argument,
// while the old code called useActor() with no arguments.
// This wrapper pre-applies the project's createActor so callers remain unchanged.

import { useActor as _useActor } from "@caffeineai/core-infrastructure";
import { type backendInterface, createActor } from "../backend";

export function useActor(): {
  actor: backendInterface | null;
  isFetching: boolean;
} {
  return _useActor(createActor) as {
    actor: backendInterface | null;
    isFetching: boolean;
  };
}
