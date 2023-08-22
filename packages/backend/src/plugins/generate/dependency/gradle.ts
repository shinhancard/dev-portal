export function createGradle(dependencies): string{
    const dependenciesArray: Dependency[] = dependencies.map(item => ({
        type: item.type,
        dependency: item.dependency,
        version: item.version
    }));
    const content = dependenciesArray
        .map(dep => {
          if(dep.version === undefined){
              return `${dep.type} ${dep.dependency}`
          }else{
              return `${dep.type} ${dep.dependency}:${dep.version}`
          }
        })
        .join('\n');
    return content;
}

type Dependency = {
    type: string;
    dependency: string;
    version: string;
}
