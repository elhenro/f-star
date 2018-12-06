function getRoute(startLoc) {
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
    let start = graph.grid[(startLoc[0] / 10)][(startLoc[1] / 10)];
    let end = graph.grid[5][5];

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