import { Graph } from './pathfind/class.graph.js';
import * as astar from './pathfind/lib.astar.js';

class Land {
    constructor(grid, options) {
        this.graph = new Graph(grid, options);
    };
    raster() {
        var rast = '';
        this.graph.grid.map(y => {
            y.map(x => {
                rast += ' ' + x.weight
            });
            rast += '\n'
        })
        return rast
    };
    around(input) {
        //graph, start, end
        var result = astar.around(
            this.graph,
            input.yx,
            input.radius
        );
        return result
    };
    search(input, weights, options) {
        weights.map(item => {
            this.graph.grid[ item.yx[0] ][ item.yx[1] ].weight = item.weight;
        });

        //graph, start, end
        var result = astar.search(
            this.graph,
            this.graph.grid[input[0]][input[1]],
            this.graph.grid[input[2]][input[3]],
            options
        );
        weights.map(item => {
            this.graph.grid[ item.yx[0] ][ item.yx[1] ].weight = 1;
        })
        return result
    };
};

export {
    Land
}