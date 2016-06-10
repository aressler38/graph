'use strict';

var __datasets = require('./datasets.js');

function Graph (canvas) {
	var _ctx = null,
		_dataset = [],
		_graphOffsets = {
			yPadding: 30,
			xPadding: 20,
		},
		_graphDimensions = {
			width: null,
			height: null,
			dx: null,
			dy: null,
		},
		_boundaryStyle = {
			'strokeStyle': 'rgba(0,0,255,0.8)',
			'lineWidth': 1.0,
			'lineCap': 'square',
			'lineJoin': 'bevel',
		},
		_axesStyle = {
			'strokeStyle': 'rgba(255,0,0,0.8)',
			'lineWidth': 1.0,
			'lineCap': 'square',
			'lineJoin': 'round',
		},
		_graphStyle = {
			'strokeStyle': 'rgba(0,0,0,1)',
			'fillStyle': 'rgba(0,0,255,0.2)',
			'lineWidth': 2.0,
			'lineCap': 'round',
			'lineJoin': 'round',
		},
		_ticksStyle = {
			'strokeStyle': 'rgba(0,0,255,1)',
			'lineWidth': 2.0,
			'lineCap': 'square',
			'lineJoin': 'miter',
			'tickHeight': 6.0,
		},
		_settings = {
			boundaries: {
				top: true,
				right: true,
				bottom: true,
				left: true,
			},
			axes: true,
			areaUnderCurve: true,
			ticks: 8,
			labels: true,
		};


	(function constructor () {
		if ( ! this instanceof Graph ) {
			throw 'Invalid invocation';
		}

		this.draw = draw;
		this.clear = clear;
		var ctx = canvas.getContext('2d');

		_initialize([]);
		_normalize(ctx);
	}).apply(this);


	function clear () {
		_ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function draw (dataset) {
		_initialize(dataset);

		// Always draw the graph
		_drawGraph();

		// Handle settings
		if ( _settings.axes ) {
			_drawAxes();

			if ( _settings.ticks ) {
				_drawTicks();
			}
		}
		if ( _settings.boundaries ) {
			_drawBoundaries();
		}
		if ( _settings.areaUnderCurve ) {
			_fillAreaUnderCurve();
		}
	}

	function _initialize (data) {
		_dataset = new __datasets.LinearDataset(data);
		_graphDimensions.width = canvas.width - 2 * _graphOffsets.xPadding;
		_graphDimensions.height = canvas.height - 2 * _graphOffsets.yPadding;
		_graphDimensions.dx = _graphDimensions.width / _dataset.metadata.xmax;
		_graphDimensions.dy = _graphDimensions.height / _dataset.metadata.ymax;
	}

	// Handle the dataset
	function _drawGraph () {
		var dx = _graphDimensions.dx,
			dy = _graphDimensions.dy,
			data = _dataset.data,
			ctx = _ctx;

		_setStyle(ctx, _graphStyle);

		ctx.beginPath();
		ctx.moveTo(0, data[0][1]*dy);
		for ( var i=1; i<data.length; ++i ) {
			ctx.lineTo(data[i][0]*dx, data[i][1]*dy);
		}
		ctx.stroke();
		ctx.closePath();
	}

	function _fillAreaUnderCurve () {
		var dx = _graphDimensions.dx,
			dy = _graphDimensions.dy,
			width = _graphDimensions.width,
			data = _dataset.data,
			ctx = _ctx,
			i;

		_setStyle(ctx, _graphStyle);

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, data[0][1]*dy);
		for ( i=1; i<data.length; ++i ) {
			ctx.lineTo(data[i][0]*dx, data[i][1]*dy);
		}
		ctx.lineTo(data[i-1][0]*dx, 0);
		ctx.fill();
		ctx.closePath();
	}

	function _drawBoundaries () {
		var width = _graphDimensions.width,
			height = _graphDimensions.height,
			ctx = _ctx;

		_setStyle(ctx, _boundaryStyle);

		if ( _settings.boundaries.top ) {
			ctx.beginPath();
			ctx.moveTo(0, height);
			ctx.lineTo(width, height);
			ctx.stroke();
			ctx.closePath();
		}

		if ( _settings.boundaries.right ) {
			ctx.beginPath();
			ctx.moveTo(width, height);
			ctx.lineTo(width, 0);
			ctx.stroke();
			ctx.closePath();
		}

		if ( _settings.boundaries.bottom ) {
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(width, 0);
			ctx.stroke();
			ctx.closePath();
		}

		if ( _settings.boundaries.left ) {
			ctx.beginPath();
			ctx.moveTo(0, height);
			ctx.lineTo(0, 0);
			ctx.stroke();
			ctx.closePath();
		}
	}

	// Cartesian X,Y axes
	function _drawAxes () {
		var width = _graphDimensions.width,
			height = _graphDimensions.height,
			xPad = _graphOffsets.xPadding * 0.5,
			yPad = _graphOffsets.yPadding * 0.5,
			ctx = _ctx;

		_setStyle(ctx, _axesStyle);

		ctx.beginPath();
		ctx.moveTo(-xPad, -yPad);
		ctx.lineTo(width + yPad, -yPad);
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.moveTo(-xPad, -yPad);
		ctx.lineTo(-xPad, height + yPad);
		ctx.stroke();
		ctx.closePath();
	}

	// Ticks on each point along x, y axes
	function _drawTicks () {
		var width = _graphDimensions.width,
			height = _graphDimensions.height,
			tickCount = _settings.ticks + 1,
			tickdx = width / ( tickCount ),
			xPad = _graphOffsets.xPadding * 0.5,
			yPad = _graphOffsets.yPadding * 0.5,
			ctx = _ctx,
			halfTickHeight, i;

		_setStyle(ctx, _ticksStyle);

		halfTickHeight = ctx.tickHeight / 2;

		ctx.beginPath();
		ctx.moveTo(0,0);
		for ( i=1; i<tickCount; ++i ) {
			ctx.moveTo(i*tickdx, -halfTickHeight - yPad);
			ctx.lineTo(i*tickdx, halfTickHeight - yPad);
		}
		ctx.stroke();
		ctx.closePath();
	}

	// Convert to cartesian and account for padding
	function _normalize (context) {
		var xPadding = _graphOffsets.xPadding,
			yPadding = _graphOffsets.yPadding,
			width = _graphDimensions.width,
			height = _graphDimensions.height;

		_ctx = {
			beginPath: function () {
				context.beginPath();
			},
			closePath: function () {
				context.closePath();
			},
			moveTo: function (x,y) {
				context.moveTo(xPadding + x, -y + ( height + yPadding ));
			},
			lineTo: function (x,y) {
				context.lineTo(xPadding + x, -y + ( height + yPadding ));
			},
			stroke: function () {
				context.stroke();
			},
			fill: function () {
				context.fill();
			},
			clearRect: function (x, y, width, height) {
				context.clearRect(x, y, width, height);
			}
		};
		Object.defineProperty( _ctx, 'fillStyle', {
			get: function () { return context.fillStyle; },
			set: function (style) { return context.fillStyle = style; },
		});
		Object.defineProperty( _ctx, 'strokeStyle', {
			get: function () { return context.strokeStyle; },
			set: function (style) { return context.strokeStyle = style; },
		});
		Object.defineProperty( _ctx, 'lineCap', {
			get: function () { return context.lineCap; },
			set: function (style) { return context.lineCap = style; },
		});
		Object.defineProperty( _ctx, 'lineWidth', {
			get: function () { return context.lineWidth; },
			set: function (style) { return context.lineWidth = style; },
		});
		Object.defineProperty( _ctx, 'lineJoin', {
			get: function () { return context.lineJoin; },
			set: function (style) { return context.lineJoin = style; },
		});
	}

	function _setStyle (ctx, styles) {
		for ( var style in styles ) {
			ctx[style] = styles[style];
		}
	}
}


module.exports = Graph;
