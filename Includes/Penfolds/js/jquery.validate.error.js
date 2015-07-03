(function($) {

	if (!$.fn.validate) throw new Error('jquery.validate.error-attr requires jquery.validate.js')

	var validate = $.fn.validate;

	$.fn.validate = function (options) {
		var messages = {};
		// Iterate through each input, find data-error-msg attribute
		$.each(this.find('input:not([attr="hidden"]), select, textarea'), function(index, element){
			var $element = $(element)
			if($element.data('error-msg')) {
				messages[$element.attr('name')] = $element.data('error-msg');
			}
		});
		return validate.apply(this, [$.extend(true, {}, options, {messages:messages})]);
	}
})(jQuery);