
L.DistanceGrid = function (cellSize) {
	this._cellSize = cellSize;
	this._sqCellSize = cellSize * cellSize;
	this._grid = {};
	this._objectPoint = { };
};

L.DistanceGrid.prototype = {

	addObject: function (obj, point) {
		// var x = this._getCoord(point.x),
		    // y = this._getCoord(point.y),
		var x = Math.floor(point.x / this._cellSize),
		    y = Math.floor(point.y / this._cellSize),
		    grid = this._grid,
		    row = grid[y] = grid[y] || {},
		    cell = row[x] = row[x] || [],
		    stamp = obj._leaflet_id || L.Util.stamp(obj);

		this._objectPoint[stamp] = {
            obj: obj,
            x: point.x,
            y: point.y
        };

		cell.push(stamp);
	},

	// updateObject: function (obj, point) {
		// this.removeObject(obj);
		// this.addObject(obj, point);
	// },

	//Returns true if the object was found
	removeObject: function (obj, point) {
		var x = Math.floor(point.x / this._cellSize),
		    y = Math.floor(point.y / this._cellSize),
		// var x = this._getCoord(point.x),
		    // y = this._getCoord(point.y),
		    grid = this._grid,
		    row = grid[y] = grid[y] || {},
		    cell = row[x] = row[x] || [],
		    stamp = obj._leaflet_id || L.Util.stamp(obj),
            objectPoint = this._objectPoint,
		    i, len;

		for (i = 0, len = cell.length; i < len; i++) {
			if (objectPoint[cell[i]].obj === obj) {

				// cell.splice(i, 1);

				if (len === 1) {
					delete row[x];
				} else {
                    cell.splice(i, 1);
                }

                // delete this._objectPoint[stamp];
                this._objectPoint[stamp] = null;

				return true;
			}
		}

	},

	// eachObject: function (fn, context) {
		// var i, j, k, len, row, cell, removed,
		    // grid = this._grid;

		// for (i in grid) {
			// row = grid[i];

			// for (j in row) {
				// cell = row[j];

				// for (k = 0, len = cell.length; k < len; k++) {
					// removed = fn.call(context, cell[k]);
					// if (removed) {
						// k--;
						// len--;
					// }
				// }
			// }
		// }
	// },

	getNearObject: function (point) {
		var x = Math.floor(point.x / this._cellSize),
		    y = Math.floor(point.y / this._cellSize),
		// var x = this._getCoord(point.x),
		    // y = this._getCoord(point.y),
		    i, j, k, row, cell, len, obj, stamp, dist,
		    objectPoint = this._objectPoint,
		    closestDistSq = this._sqCellSize,
		    closest = null;

		for (i = y - 1; i <= y + 1; i++) {
			row = this._grid[i];
			if (row) {

				for (j = x - 1; j <= x + 1; j++) {
					cell = row[j];
					if (cell) {

						for (k = 0, len = cell.length; k < len; k++) {
							item = objectPoint[cell[k]];
                            //stamp = obj._leaflet_id || L.Util.stamp(obj);
							dist = this._sqDist(item, point);
							if (dist < closestDistSq) {
								closestDistSq = dist;
								closest = item.obj;
							}
						}
					}
				}
			}
		}
		return closest;
	},

	// _getCoord: function (x) {
		// return Math.floor(x / this._cellSize);
	// },

	_sqDist: function (p, p2) {
		var dx = p2.x - p.x,
		    dy = p2.y - p.y;
		return dx * dx + dy * dy;
	}
};
