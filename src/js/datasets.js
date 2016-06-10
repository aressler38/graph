var metadata = require('./metadata.js');

function Dataset () {
	this.data = [];
	this.metadata = {};
}

function LinearDataset (data) {
	this.metadata = new metadata.LinearDatasetMetadata(data);
	this.data = data;
}

module.exports = {
	Dataset: Dataset,
	LinearDataset: LinearDataset,
};
