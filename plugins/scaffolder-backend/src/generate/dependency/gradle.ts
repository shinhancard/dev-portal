export function createGradle(dependencies: any): string {
  const dependenciesArray: Dependency[] = dependencies.map(
    (item: Dependency) => ({
      type: item.type,
      dependency: item.dependency,
      version: item.version,
    }),
  );
  const content = dependenciesArray
    .map(dep => {
      if (dep.version === undefined) {
        return `${dep.type} ${dep.dependency}`;
      }
      return `${dep.type} ${dep.dependency}:${dep.version}`;
    })
    .join('\n');
  return content;
}

type Dependency = {
  type: string;
  dependency: string;
  version: string;
};
