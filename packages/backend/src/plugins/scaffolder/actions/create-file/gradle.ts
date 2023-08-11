export function createGradle(dependencies: undefined[]): string{
    let dependency;
    for(dependency in dependencies){
        console.log(dependency);
        console.log(dependency.type);
        console.log(dependency.dependency-name);
        console.log(dependency.version);
    }
    return dependencies.join('\n');
}
