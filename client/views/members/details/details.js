var pageSession = new ReactiveDict();

Template.MembersDetails.rendered = function() {
	
};

Template.MembersDetails.events({
	
});

Template.MembersDetails.helpers({
	
});

Template.MembersDetailsDetailsForm.rendered = function() {
	

	pageSession.set("membersDetailsDetailsFormInfoMessage", "");
	pageSession.set("membersDetailsDetailsFormErrorMessage", "");

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

Template.MembersDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("membersDetailsDetailsFormInfoMessage", "");
		pageSession.set("membersDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var membersDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(membersDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("membersDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("membersDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("members", {});
	}

	
});

Template.MembersDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("membersDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("membersDetailsDetailsFormErrorMessage");
	}
	
});
