this.Parkings = new Mongo.Collection("parkings");

this.Parkings.userCanInsert = function(userId, doc) {
	return true;
};

this.Parkings.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Parkings.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
