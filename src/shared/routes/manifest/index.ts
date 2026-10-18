export type ModuleRoute = {
  path: string
}

export function listModulePaths(
  ...groups: ReadonlyArray<ReadonlyArray<ModuleRoute>>
): string[] {
  return groups.flatMap((group) => group.map((route) => route.path))
}
