function generateLinearDataset (length) {
	var data = [],
		r, i, x;

	for ( i=0; i<(length); ) {
		r = Math.random();
		x = Math.random() * 2;
		i += x;
		data.push([ i, r ]);
	}

	return data;
}
