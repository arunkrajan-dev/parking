Parkings.allow({
	insert: function (userId, doc) {
		return Parkings.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Parkings.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Parkings.userCanRemove(userId, doc);
	}
});

Parkings.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Parkings.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Parkings.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

Parkings.before.remove(function(userId, doc) {
	
});

Parkings.after.insert(function(userId, doc) {
	
});

Parkings.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Parkings.after.remove(function(userId, doc) {
	
});
