function getRoute(startLoc, tloc) {
    //console.log(startLoc);

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
    console.log(Math.round(startLoc.x), Math.round(startLoc.y));
    let start = graph.grid[(Math.round(startLoc.x / 10))][Math.round(startLoc.y / 10)];
    let end = graph.grid[tloc[0]][tloc[1]];

    // result is an array containing the shortest path
    let result = astar.search(graph, start, end);

    //console.log(graph);
    //console.log(result);

    let mockMap = [];
    for (let step of result) {
        mockMap.push([step.x, step.y]);
    }

    return mockMap;
}