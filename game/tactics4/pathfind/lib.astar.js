import { BinaryHeap } from './class.binaryHeap.js';
// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
var heuristics = {
    manhattan: function(pos0, pos1) {
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    },
    diagonal: function(pos0, pos1) {
        var D = 1;
        var D2 = Math.sqrt(2);
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    }
};

function pathTo(node) {
    var curr = node;
    var path = [];
    while (curr.parent) {
        path.unshift(curr);
        curr = curr.parent;
    }
    return path;
};

function getHeap() {
    return new BinaryHeap(function(node) {
        return node.f;
    });
};

// javascript-astar 0.4.1
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a Binary Heap.
// Includes Binary Heap (with modifications) from Marijn Haverbeke.
// http://eloquentjavascript.net/appendix2.html
/**
* Perform an A* Search on a graph given a start and end node.
* @param {Graph} graph
* @param {GridNode} start
* @param {GridNode} end
* @param {Object} [options]
* @param {bool} [options.closest] Specifies whether to return the
           path to the closest node if the target is unreachable.
* @param {Function} [options.heuristic] Heuristic function (see
*          astar.heuristics).
*/
function search(graph, start, end, options) {
    graph.cleanDirty();
    options = options || {};
    var heuristic = heuristics[options.heuristic] || heuristics.diagonal;
    var closest = options.closest || false;
    var clean = options.clean || false;

    var openHeap = getHeap();
    var closestNode = start; // set the start node to be the closest if required

    start.h = heuristic(start, end);
    graph.markDirty(start);

    openHeap.push(start);

    while (openHeap.size() > 0) {

        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
        var currentNode = openHeap.pop();

        // End case -- result has been found, return the traced path.
        if (currentNode === end) {
            return pathTo(currentNode);
        }

        // Normal case -- move currentNode from open to closed, process each of its neighbors.
        currentNode.closed = true;

        // Find all neighbors for the current node.
        var neighbors = graph.neighbors(currentNode);

        for (var i = 0, il = neighbors.length; i < il; ++i) {
            var neighbor = neighbors[i];
            var isWall = clean ? false : neighbor.isWall();

            if (neighbor.closed || isWall) {
                // Not a valid node to process, skip to next neighbor.
                continue;
            }

            // The g score is the shortest distance from start to current node.
            // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
            var gScore = currentNode.g + neighbor.getCost(currentNode);
            var beenVisited = neighbor.visited;

            if (!beenVisited || gScore < neighbor.g) {

                // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                neighbor.visited = true;
                neighbor.parent = currentNode;
                neighbor.h = neighbor.h || heuristic(neighbor, end);
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
                graph.markDirty(neighbor);
                if (closest) {
                    // If the neighbour is closer than the current closestNode or if it's equally close but has
                    // a cheaper path than the current closest node then it becomes the closest node
                    if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                        closestNode = neighbor;
                    }
                }

                if (!beenVisited) {
                    // Pushing to heap will put it in proper place based on the 'f' value.
                    openHeap.push(neighbor);
                } else {
                    // Already seen the node, but since it has been rescored we need to reorder it in the heap
                    openHeap.rescoreElement(neighbor);
                }
            }
        }
    }

    if (closest) {
        return pathTo(closestNode);
    }

    // No result was found - empty array signifies failure to find path.
    return [];
};
function around(graph, start, radius) {
    //graph, start, end
    var x = start[0];
    var y = start[1];
    var radius = radius;
    var area = [];

    if (graph.hex) {
        var r = 1; //because directions.map is the first circle
        var directions = [[0,-1], [-1,-1], [-1,0], [0,1], [1,1], [1,0]];
        directions.map(dir => {
            if (graph.grid[x + dir[0]] && graph.grid[x + dir[0]][y + dir[1]]) area.push([x + dir[0], y + dir[1]])
        })
        while (r < radius) {
            ++r;
            area.map(item => {
                directions.map(dir => {
                    if (graph.grid[item[0] + dir[0]] && graph.grid[item[0] + dir[0]][item[1] + dir[1]]) area.push([item[0] + dir[0], item[1] + dir[1]])
                })
            });
        };
        // for (let s = -radius; s <= radius; ++s) {
        //     var sign = s < 0 ? -radius - s : -radius;
        //     var qty = s < 0 ? radius : radius - s;
        //     for (let r = sign; r <= qty; ++r) {
        //         //push from up to down
        //         if (graph.grid[x + r] && graph.grid[x + r][y + s]) {
        //             area.push([x + r, y + s]);
        //         };
        //     };
        // };
    } else {
        for (let s = -radius; s <= radius; ++s) {
            var sign = -radius;
            var qty = radius;
            for (let r = sign; r <= qty; ++r) {
                //push from up to down
                if (graph.grid[x + r] && graph.grid[x + r][y + s]) {
                    area.push([x + r, y + s]);
                };
            };
        };
    };
    return area
};
function cleanNode(node) {
    node.f = 0;
    node.g = 0;
    node.h = 0;
    node.visited = false;
    node.closed = false;
    node.parent = null;
};

export {
    search,
    around,
    cleanNode
};
