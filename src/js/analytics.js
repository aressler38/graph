
// Consolidate data metrics here.
function LinearDatasetMetadata (dataset) {
	this.xmax = null;
	this.xmin = null;
	this.ymin = null;
	this.ymax = null;
	this.count = dataset.length;
	this.type = 'linear';

	var object = dataset[0];

	if ( dataset.length && object ) {
		this.xmin = object.value;
		this.xmax = object.value;

		for ( object of dataset ) {
			if ( ! object.value ) continue;

			// x-coordinates
			if ( object.value < this.xmin ) {
				this.xmin = object.value;
			}
			if ( object.value > this.xmax ) {
				this.xmax = object.value;
			}

			// y-coordinates
			if ( object.value < this.ymin ) {
				this.ymin = object.value;
			}
			if ( object.value > this.ymax ) {
				this.ymax = object.value;
			}
		}
	}
}


module.exports = {
	getDatasetMetadata: function (dataset) {
		return new LinearDatasetMetadata(dataset);
	},
};
