function getRoute(startLoc, targetLoc) {
    let gridConst = 100; //todo: rename

    function createAStarGrid() {
        let blockedGridLocs = [];
        /*for (let obstacle of obstacles) {
            blockedGridLocs.push(getLocationOnGrid(obstacle.position.x, obstacle.position.y));
        }*/
        // create empty grid
        let gridGraph = [];
        for (let i = 0; i < render.options.height / gridConst; i++) {
            let gridGraphRow = [];
            for (let j = 0; j < render.options.width / gridConst; j++) {
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
        return gridGraph;
    }

    let graph = new Graph(createAStarGrid());
    console.log('start from grid node', startLoc.x, startLoc.y);
    let start = graph.grid[startLoc.x][startLoc.y];
    let end = graph.grid[targetLoc[0]][targetLoc[1]];

    // result is an array containing the path
    let result = astar.search(graph, start, end);

    console.log('Graph', graph);
    //console.log(result);

    let mockMap = [];
    for (let step of result) {
        mockMap.push([step.x, step.y]);
    }

    return mockMap;
}