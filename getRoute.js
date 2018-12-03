function createAStarGrid() {
    let blockedGridLocs = [];
    /*for (let obstacle of obstacles) {
        blockedGridLocs.push(getLocationOnGrid(obstacle.position.x, obstacle.position.y));
    }*/

    //console.log('blocked grid cells', blockedGridLocs);

    // create empty grid
    let gridGraph = [];
    for (let i = 0; i < 400 / 10; i++) {
        let gridGraphRow = [];
        for (let j = 0; j < 600 / 10; j++) {
            gridGraphRow.push(1);
        }
        gridGraph.push(gridGraphRow);
    }

    // update grid with blocked locations
    for (let blockedGridLoc of blockedGridLocs) {
        let x = blockedGridLoc[0];
        let y = blockedGridLoc[1];
        gridGraph[y][x] = 0;
    }

    //console.log(gridGraph);
    return gridGraph
}

let graph = new Graph(createAStarGrid());
let start = graph.grid[19][40];
let end = graph.grid[17][20];

// result is an array containing the shortest path
let result = astar.search(graph, start, end);

console.log(graph);
console.log(result);

let mockMap = [];
for (step of result) {
    mockMap.push([step.x, step.y]);
}

console.log(mockMap);