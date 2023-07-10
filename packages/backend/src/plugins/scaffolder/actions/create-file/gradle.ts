export function createGradle(dependencies: Dependency[]): string{
    let dependency;
    for(dependency in dependencies){
        console.log(dependency);
        console.log(dependency.type);
        console.log(dependency.dependency-name);
        console.log(dependency.version);
    }
    const content = dependencies
        .map(dep => `type: ${dep.type}, dependency: ${dep.dependency}, version: ${dep.version}`)
        .join('\n');
    return content;
}


interface Dependency {
    type: string;
    dependency: string;
    version: string;
}
