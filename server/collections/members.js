Members.allow({
	insert: function (userId, doc) {
		return Members.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Members.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Members.userCanRemove(userId, doc);
	}
});

Members.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Members.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Members.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

Members.before.remove(function(userId, doc) {
	
});

Members.after.insert(function(userId, doc) {
	
});

Members.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Members.after.remove(function(userId, doc) {
	
});
