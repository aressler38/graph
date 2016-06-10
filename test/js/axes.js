if ( document.readyState === 'complete' || document.readyState === 'interactive' ) {
	init();
} else {
	document.addEventListener( 'DOMContentLoaded', init );
}

function init () {
	window.graph = new Graph(document.querySelector('#graph1'));

	window.graph.draw(generateLinearDataset(40));
}
