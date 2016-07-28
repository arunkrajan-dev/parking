var pageSession = new ReactiveDict();

Template.MembersEdit.rendered = function() {
	
};

Template.MembersEdit.events({
	
});

Template.MembersEdit.helpers({
	
});

Template.MembersEditEditForm.rendered = function() {
	

	pageSession.set("membersEditEditFormInfoMessage", "");
	pageSession.set("membersEditEditFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.MembersEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("membersEditEditFormInfoMessage", "");
		pageSession.set("membersEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var membersEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(membersEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("membersEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("members", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("membersEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Members.update({ _id: t.data.member_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("members", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.MembersEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("membersEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("membersEditEditFormErrorMessage");
	}
	
});
