let astar = require("./../oldThings/assets/libs/a-star.js")

export default class GetRoute {
    constructor(startLoc, targetLoc, obstacles) {
        let gridConst = 100;

        // todo: use the chair method instead of rewriting the function here
        function getLocationOnGrid(position) {
            let columns = 100;
            let rows = 100;

            let x = Math.round(position.x / columns);
            let y = Math.round(position.y / rows);

            return {x, y};
        }

        function createAStarGrid() {
            // create empty grid
            let gridGraph = [];
            for (let i = 0; i < 1000 / gridConst; i++) {
                let gridGraphRow = [];
                for (let j = 0; j < 1000 / gridConst; j++) {
                    gridGraphRow.push(1);
                }
                gridGraph.push(gridGraphRow);
            }

            // update grid with blocked locations
            if (window.obstacles.length > 0) {
                for (let obstacle of window.obstacles) {
                    if (obstacle[0] && obstacle[1] && obstacle[2]) {
                        let position = getLocationOnGrid({x: obstacle[1], y: obstacle[2]});
                        //console.log(position);
                        gridGraph[position.x][position.y] = 0;
                    }
                }
            }
            return gridGraph;
        }

        let graph = new astar.Graph(createAStarGrid());
        //console.log('calculating new route from: ', startLoc.x, startLoc.y);
        //console.log(startLoc, targetLoc)

        let start = graph.grid[startLoc.x / gridConst][startLoc.y / gridConst];
        let end = graph.grid[targetLoc.x][targetLoc.y];

        // result is an array containing the path
        let result = astar.astar.search(graph, start, end);

        //console.log('Graph', graph);

        let mockMap = [];
        for (let step of result) {
            mockMap.push([step.x, step.y]);
        }

        return mockMap;
    }
}