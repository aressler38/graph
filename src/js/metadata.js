// Consolidate data metrics here.
function LinearDatasetMetadata (data) {
	this.xmax = null;
	this.xmin = null;
	this.ymin = null;
	this.ymax = null;
	this.count = data.length;
	this.type = 'linear';

	var object = data[0];

	if ( data.length && object ) {
		this.xmin = object[0];
		this.xmax = object[0];
		this.ymin = object[1];
		this.ymax = object[1];

		for ( object of data ) {
			if ( ! object[0] || ! object[1] ) continue;

			// x-coordinates
			if ( object[0] < this.xmin ) {
				this.xmin = object[0];
			}
			if ( object[0] > this.xmax ) {
				this.xmax = object[0];
			}

			// y-coordinates
			if ( object[1] < this.ymin ) {
				this.ymin = object[1];
			}
			if ( object[1] > this.ymax ) {
				this.ymax = object[1];
			}
		}
	}
}


module.exports = {
	LinearDatasetMetadata: LinearDatasetMetadata,
};
