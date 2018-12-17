function getRoute(startLoc, targetLoc) {
    let gridConst = 100; //todo: rename

    // todo: use the chair method instead of rewriting the function here
    function getLocationOnGrid(position) {
        let columns = 100;
        let rows = 100;

        let x = Math.round(position.x / columns);
        let y = Math.round(position.y / rows);

        return {x: x, y: y};
    }

    function createAStarGrid() {
        let blockedGridLocs = [];
        /*        for (let obstacle of this.chairs) {
                    blockedGridLocs.push(getLocationOnGrid(obstacle.position));
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
        if (obstacles.length > 0) {
            for (let obstacle of obstacles) {
                let position = getLocationOnGrid({x: obstacle[1], y: obstacle[2]})
                gridGraph[position.x][position.y] = 0;
            }
        }
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