define(function(require, exports, module) {
    var zxcvbn = require('zxcvbn');
    return function($) {
        var word_map = [
            "too-short",
            "very-weak",
            "weak",
            "good",
            "strong"
        ];

        function rating(rate, message) {
            return {
                rate: rate,
                messageKey: message
            };
        }

        var passwordRating = function(password, exclude_regx) {
            /**
             * 检查排除字母项  
             */
            if(exclude_regx && exclude_regx.test(password)) return rating(-1, "exclude-char"); 

            var result = zxcvbn(password);
            return rating(result.score, word_map[result.score]);
        }

        passwordRating.messages = {
            "exclude-char": "密码不能包含 ",
            "too-short": "弱:",
            "very-weak": "弱:",
            "weak": "弱:",
            "good": "",
            "strong": ""
        }

        passwordRating.show_safe_meter = {
            "exclude-char": "inline",
            "too-short": "inline",
            "very-weak": "inline",
            "weak": "inline",
            "good": "none",
            "strong": "none"
        }

        $.validator.addMethod("zxpassword", function(value, element, exclude_regx) {
            // use untrimmed value
            var password = element.value;
            var rating = passwordRating(password, exclude_regx.regx);
            // update message for this field
            var meter = $(".password-meter", element.form);

            var rating_message = passwordRating.messages[rating.messageKey];
            if(rating.rate == -1){
                rating_message += exclude_regx.message; 
            }

            meter.find(".password-meter-bar").removeClass().addClass("password-meter-bar").addClass("password-meter-" + rating.messageKey);
            meter.find(".password-meter-message").removeClass().addClass("password-meter-message").addClass("password-meter-message-" + rating.messageKey).text(rating_message);
            meter.find(".password-meter-safe").css("display", passwordRating.show_safe_meter[rating.messageKey]);
            // display process bar instead of error message
            return rating.rate > 2;
        }, "&nbsp;");

    }
});
