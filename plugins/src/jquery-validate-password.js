/*
 * jQuery validate.password plug-in 1.0
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validate.password/
 *
 * Copyright (c) 2009 Jörn Zaefferer
 *
 * $Id$
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

define(function(require, exports, module) {
    return function($) {

        var LOWER = /[a-z]/,
            UPPER = /[A-Z]/,
            DIGIT = /[0-9]/,
            DIGITS = /[0-9].*[0-9]/,
            SPECIAL = /[^a-zA-Z0-9]/,
            SAME = /^(.)\1+$/;

        function rating(rate, message) {
            return {
                rate: rate,
                messageKey: message
            };
        }

        function uncapitalize(str) {
            return str.substring(0, 1).toLowerCase() + str.substring(1);
        }

        var passwordRating = function(password, username) {
            if (!password || password.length < 8) return rating(0, "too-short");
            if (username && password.toLowerCase().match(username.toLowerCase())) return rating(0, "similar-to-username");
            if (SAME.test(password)) return rating(1, "very-weak");

            var lower = LOWER.test(password),
                upper = UPPER.test(uncapitalize(password)),
                digit = DIGIT.test(password),
                digits = DIGITS.test(password),
                special = SPECIAL.test(password);

            if (lower && upper && digit || lower && digits || upper && digits || special) return rating(4, "strong");
            if (lower && upper || lower && digit || upper && digit) return rating(3, "good");
            return rating(2, "weak");
        }

        passwordRating.messages = {
            "similar-to-username": "密码不能和用户名相同",
            "too-short": "弱:密码为8-16位",
            "very-weak": "太弱:试试字母,数字和标点混合",
            "weak": "弱:试试字母,数字和标点混合",
            "good": "中:试试字母,数字和标点混合",
            "strong": "强:请牢记您的密码"
        }

        $.validator.addMethod("general_password", function(value, element, usernameField) {
            // use untrimmed value
            var password = element.value,
                // get username for comparison, if specified
                username = $(typeof usernameField != "boolean" ? usernameField : []);

            var rating = passwordRating(password, username.val());
            // update message for this field
            var meter = $(".password-meter", element.form);

            meter.find(".password-meter-bar").removeClass().addClass("password-meter-bar").addClass("password-meter-" + rating.messageKey);
            meter.find(".password-meter-message").removeClass().addClass("password-meter-message").addClass("password-meter-message-" + rating.messageKey).text(passwordRating.messages[rating.messageKey]);
            // display process bar instead of error message
            return rating.rate > 3;
        }, "&nbsp;");

        // manually add class rule, to make username param optional
        // $.validator.classRuleSettings.password = {
        //     password: true
        // };

    }
});
