/*!
 * jQuery Validation Plugin 1.10.0
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2011 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

define(function() {
    return function(jQuery) {
        var $ = jQuery; 

        function stripHtml(value) {
            // remove html tags and space chars
            return value.replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ')
            // remove punctuation
            .replace(/[.(),;:!?%#$'"_+=\/-]*/g, '');
        }
        jQuery.validator.addMethod("maxWords", function(value, element, params) {
            return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
        }, jQuery.validator.format("Please enter {0} words or less."));

        jQuery.validator.addMethod("minWords", function(value, element, params) {
            return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
        }, jQuery.validator.format("Please enter at least {0} words."));

        jQuery.validator.addMethod("rangeWords", function(value, element, params) {
            var valueStripped = stripHtml(value);
            var regex = /\b\w+\b/g;
            return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
        }, jQuery.validator.format("Please enter between {0} and {1} words."));

        jQuery.validator.addMethod("letterswithbasicpunc", function(value, element) {
            return this.optional(element) || /^[a-z\-.,()'\"\s]+$/i.test(value);
        }, "Letters or punctuation only please");

        jQuery.validator.addMethod("alphanumeric", function(value, element) {
            return this.optional(element) || /^\w+$/i.test(value);
        }, "Letters, numbers, and underscores only please");

        jQuery.validator.addMethod("lettersonly", function(value, element) {
            return this.optional(element) || /^[a-z]+$/i.test(value);
        }, "Letters only please");

        jQuery.validator.addMethod("nowhitespace", function(value, element) {
            return this.optional(element) || /^\S+$/i.test(value);
        }, "No white space please");

        jQuery.validator.addMethod("ziprange", function(value, element) {
            return this.optional(element) || /^90[2-5]\d\{2\}-\d{4}$/.test(value);
        }, "Your ZIP-code must be in the range 902xx-xxxx to 905-xx-xxxx");

        jQuery.validator.addMethod("zipcodeUS", function(value, element) {
            return this.optional(element) || /\d{5}-\d{4}$|^\d{5}$/.test(value)
        }, "The specified US ZIP Code is invalid");

        jQuery.validator.addMethod("integer", function(value, element) {
            return this.optional(element) || /^-?\d+$/.test(value);
        }, "A positive or negative non-decimal number please");

        /**
         * Return true, if the value is a valid vehicle identification number (VIN).
         *
         * Works with all kind of text inputs.
         *
         * @example <input type="text" size="20" name="VehicleID" class="{required:true,vinUS:true}" />
         * @desc Declares a required input element whose value must be a valid vehicle identification number.
         *
         * @name jQuery.validator.methods.vinUS
         * @type Boolean
         * @cat Plugins/Validate/Methods
         */
        jQuery.validator.addMethod("vinUS", function(v) {
            if (v.length != 17) {
                return false;
            }
            var i, n, d, f, cd, cdv;
            var LL = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            var VL = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9];
            var FL = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
            var rs = 0;
            for (i = 0; i < 17; i++) {
                f = FL[i];
                d = v.slice(i, i + 1);
                if (i == 8) {
                    cdv = d;
                }
                if (!isNaN(d)) {
                    d *= f;
                } else {
                    for (n = 0; n < LL.length; n++) {
                        if (d.toUpperCase() === LL[n]) {
                            d = VL[n];
                            d *= f;
                            if (isNaN(cdv) && n == 8) {
                                cdv = LL[n];
                            }
                            break;
                        }
                    }
                }
                rs += d;
            }
            cd = rs % 11;
            if (cd == 10) {
                cd = "X";
            }
            if (cd == cdv) {
                return true;
            }
            return false;
        }, "The specified vehicle identification number (VIN) is invalid.");

        /**
         * Return true, if the value is a valid date, also making this formal check dd/mm/yyyy.
         *
         * @example jQuery.validator.methods.date("01/01/1900")
         * @result true
         *
         * @example jQuery.validator.methods.date("01/13/1990")
         * @result false
         *
         * @example jQuery.validator.methods.date("01.01.1900")
         * @result false
         *
         * @example <input name="pippo" class="{dateITA:true}" />
         * @desc Declares an optional input element whose value must be a valid date.
         *
         * @name jQuery.validator.methods.dateITA
         * @type Boolean
         * @cat Plugins/Validate/Methods
         */
        jQuery.validator.addMethod("dateITA", function(value, element) {
            var check = false;
            var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            if (re.test(value)) {
                var adata = value.split('/');
                var gg = parseInt(adata[0], 10);
                var mm = parseInt(adata[1], 10);
                var aaaa = parseInt(adata[2], 10);
                var xdata = new Date(aaaa, mm - 1, gg);
                if ((xdata.getFullYear() == aaaa) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == gg)) check = true;
                else check = false;
            } else check = false;
            return this.optional(element) || check;
        }, "Please enter a correct date");

        jQuery.validator.addMethod("dateNL", function(value, element) {
            return this.optional(element) || /^\d\d?[\.\/-]\d\d?[\.\/-]\d\d\d?\d?$/.test(value);
        }, "Vul hier een geldige datum in.");

        jQuery.validator.addMethod("time", function(value, element) {
            return this.optional(element) || /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(value);
        }, "Please enter a valid time, between 00:00 and 23:59");
        jQuery.validator.addMethod("time12h", function(value, element) {
            return this.optional(element) || /^((0?[1-9]|1[012])(:[0-5]\d){0,2}(\ [AP]M))$/i.test(value);
        }, "Please enter a valid time, between 00:00 am and 12:00 pm");

        /**
         * matches US phone number format
         *
         * where the area code may not start with 1 and the prefix may not start with 1
         * allows '-' or ' ' as a separator and allows parens around area code
         * some people may want to put a '1' in front of their number
         *
         * 1(212)-999-2345 or
         * 212 999 2344 or
         * 212-999-0983
         *
         * but not
         * 111-123-5434
         * and not
         * 212 123 4567
         */
        jQuery.validator.addMethod("phoneUS", function(phone_number, element) {
            phone_number = phone_number.replace(/\s+/g, "");
            return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
        }, "Please specify a valid phone number");

        jQuery.validator.addMethod('phoneUK', function(phone_number, element) {
            phone_number = phone_number.replace(/\(|\)|\s+|-/g, '');
            return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:(?:\d{5}\)?\s?\d{4,5})|(?:\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3}))|(?:\d{3}\)?\s?\d{3}\s?\d{3,4})|(?:\d{2}\)?\s?\d{4}\s?\d{4}))$/);
        }, 'Please specify a valid phone number');

        jQuery.validator.addMethod('mobileUK', function(phone_number, element) {
            phone_number = phone_number.replace(/\s+|-/g, '');
            return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[45789]\d{2}|624)\s?\d{3}\s?\d{3})$/);
        }, 'Please specify a valid mobile number');

        //Matches UK landline + mobile, accepting only 01-3 for landline or 07 for mobile to exclude many premium numbers
        jQuery.validator.addMethod('phonesUK', function(phone_number, element) {
            phone_number = phone_number.replace(/\s+|-/g, '');
            return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[45789]\d{8}|624\d{6})))$/);
        }, 'Please specify a valid uk phone number');
        // On the above three UK functions, do the following server side processing:
        //  Compare with ^((?:00\s?|\+)(44)\s?)?\(?0?(?:\)\s?)?([1-9]\d{1,4}\)?[\d\s]+)
        //  Extract $2 and set $prefix to '+44<space>' if $2 is '44' otherwise set $prefix to '0'
        //  Extract $3 and remove spaces and parentheses. Phone number is combined $2 and $3.
        // A number of very detailed GB telephone number RegEx patterns can also be found at:
        // http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_UK_Telephone_Numbers
        //Matches UK postcode. based on http://snipplr.com/view/3152/postcode-validation/
        jQuery.validator.addMethod('postcodeUK', function(postcode, element) {
            postcode = (postcode.toUpperCase()).replace(/\s+/g, '');
            return this.optional(element) || postcode.match(/^([^QZ][^IJZ]{0,1}\d{1,2})(\d[^CIKMOV]{2})$/) || postcode.match(/^([^QV]\d[ABCDEFGHJKSTUW])(\d[^CIKMOV]{2})$/) || postcode.match(/^([^QV][^IJZ]\d[ABEHMNPRVWXY])(\d[^CIKMOV]{2})$/) || postcode.match(/^(GIR)(0AA)$/) || postcode.match(/^(BFPO)(\d{1,4})$/) || postcode.match(/^(BFPO)(C\/O\d{1,3})$/);
        }, 'Please specify a valid postcode');

        // TODO check if value starts with <, otherwise don't try stripping anything
        jQuery.validator.addMethod("strippedminlength", function(value, element, param) {
            return jQuery(value).text().length >= param;
        }, jQuery.validator.format("Please enter at least {0} characters"));

        // same as email, but TLD is optional
        jQuery.validator.addMethod("email2", function(value, element, param) {
            return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
        }, jQuery.validator.messages.email);

        // same as url, but TLD is optional
        jQuery.validator.addMethod("url2", function(value, element, param) {
            return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
        }, jQuery.validator.messages.url);

        // NOTICE: Modified version of Castle.Components.Validator.CreditCardValidator
        // Redistributed under the the Apache License 2.0 at http://www.apache.org/licenses/LICENSE-2.0
        // Valid Types: mastercard, visa, amex, dinersclub, enroute, discover, jcb, unknown, all (overrides all other settings)
        jQuery.validator.addMethod("creditcardtypes", function(value, element, param) {
            if (/[^0-9-]+/.test(value)) {
                return false;
            }

            value = value.replace(/\D/g, "");

            var validTypes = 0x0000;

            if (param.mastercard) validTypes |= 0x0001;
            if (param.visa) validTypes |= 0x0002;
            if (param.amex) validTypes |= 0x0004;
            if (param.dinersclub) validTypes |= 0x0008;
            if (param.enroute) validTypes |= 0x0010;
            if (param.discover) validTypes |= 0x0020;
            if (param.jcb) validTypes |= 0x0040;
            if (param.unknown) validTypes |= 0x0080;
            if (param.all) validTypes = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0040 | 0x0080;

            if (validTypes & 0x0001 && /^(5[12345])/.test(value)) { //mastercard
                return value.length == 16;
            }
            if (validTypes & 0x0002 && /^(4)/.test(value)) { //visa
                return value.length == 16;
            }
            if (validTypes & 0x0004 && /^(3[47])/.test(value)) { //amex
                return value.length == 15;
            }
            if (validTypes & 0x0008 && /^(3(0[012345]|[68]))/.test(value)) { //dinersclub
                return value.length == 14;
            }
            if (validTypes & 0x0010 && /^(2(014|149))/.test(value)) { //enroute
                return value.length == 15;
            }
            if (validTypes & 0x0020 && /^(6011)/.test(value)) { //discover
                return value.length == 16;
            }
            if (validTypes & 0x0040 && /^(3)/.test(value)) { //jcb
                return value.length == 16;
            }
            if (validTypes & 0x0040 && /^(2131|1800)/.test(value)) { //jcb
                return value.length == 15;
            }
            if (validTypes & 0x0080) { //unknown
                return true;
            }
            return false;
        }, "Please enter a valid credit card number.");

        jQuery.validator.addMethod("ipv4", function(value, element, param) {
            return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
        }, "Please enter a valid IP v4 address.");

        jQuery.validator.addMethod("ipv6", function(value, element, param) {
            return this.optional(element) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(value);
        }, "Please enter a valid IP v6 address.");

        /**
         * Return true if the field value matches the given format RegExp
         *
         * @example jQuery.validator.methods.pattern("AR1004",element,/^AR\d{4}$/)
         * @result true
         *
         * @example jQuery.validator.methods.pattern("BR1004",element,/^AR\d{4}$/)
         * @result false
         *
         * @name jQuery.validator.methods.pattern
         * @type Boolean
         * @cat Plugins/Validate/Methods
         */
        jQuery.validator.addMethod("pattern", function(value, element, param) {
            if (this.optional(element)) {
                return true;
            }
            if (typeof param === 'string') {
                param = new RegExp('^(?:' + param + ')$');
            }
            return param.test(value);
        }, "Invalid format.");


        /*
         * Lets you say "at least X inputs that match selector Y must be filled."
         *
         * The end result is that neither of these inputs:
         *
         *  <input class="productinfo" name="partnumber">
         *  <input class="productinfo" name="description">
         *
         *  ...will validate unless at least one of them is filled.
         *
         * partnumber:  {require_from_group: [1,".productinfo"]},
         * description: {require_from_group: [1,".productinfo"]}
         *
         */
        jQuery.validator.addMethod("require_from_group", function(value, element, options) {
            var validator = this;
            var selector = options[1];
            var validOrNot = $(selector, element.form).filter(function() {
                return validator.elementValue(this);
            }).length >= options[0];

            if (!$(element).data('being_validated')) {
                var fields = $(selector, element.form);
                fields.data('being_validated', true);
                fields.valid();
                fields.data('being_validated', false);
            }
            return validOrNot;
        }, jQuery.format("Please fill at least {0} of these fields."));

        /*
         * Lets you say "either at least X inputs that match selector Y must be filled,
         * OR they must all be skipped (left blank)."
         *
         * The end result, is that none of these inputs:
         *
         *  <input class="productinfo" name="partnumber">
         *  <input class="productinfo" name="description">
         *  <input class="productinfo" name="color">
         *
         *  ...will validate unless either at least two of them are filled,
         *  OR none of them are.
         *
         * partnumber:  {skip_or_fill_minimum: [2,".productinfo"]},
         *  description: {skip_or_fill_minimum: [2,".productinfo"]},
         * color:       {skip_or_fill_minimum: [2,".productinfo"]}
         *
         */
        jQuery.validator.addMethod("skip_or_fill_minimum", function(value, element, options) {
            var validator = this;

            numberRequired = options[0];
            selector = options[1];
            var numberFilled = $(selector, element.form).filter(function() {
                return validator.elementValue(this);
            }).length;
            var valid = numberFilled >= numberRequired || numberFilled === 0;

            if (!$(element).data('being_validated')) {
                var fields = $(selector, element.form);
                fields.data('being_validated', true);
                fields.valid();
                fields.data('being_validated', false);
            }
            return valid;
        }, jQuery.format("Please either skip these fields or fill at least {0} of them."));

        // Accept a value from a file input based on a required mimetype
        jQuery.validator.addMethod("accept", function(value, element, param) {
            // Split mime on commas incase we have multiple types we can accept
            var typeParam = typeof param === "string" ? param.replace(/,/g, '|') : "image/*",
                optionalValue = this.optional(element),
                i, file;

            // Element is optional
            if (optionalValue) {
                return optionalValue;
            }

            if ($(element).attr("type") === "file") {
                // If we are using a wildcard, make it regex friendly
                typeParam = typeParam.replace("*", ".*");

                // Check if the element has a FileList before checking each file
                if (element.files && element.files.length) {
                    for (i = 0; i < element.files.length; i++) {
                        file = element.files[i];

                        // Grab the mimtype from the loaded file, verify it matches
                        if (!file.type.match(new RegExp(".?(" + typeParam + ")$", "i"))) {
                            return false;
                        }
                    }
                }
            }

            // Either return true because we've validated each file, or because the
            // browser does not support element.files and the FileList feature
            return true;
        }, jQuery.format("Please enter a value with a valid mimetype."));

        // Older "accept" file extension method. Old docs: http://docs.jquery.com/Plugins/Validation/Methods/accept
        jQuery.validator.addMethod("extension", function(value, element, param) {
            param = typeof param === "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
            return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
        }, jQuery.format("Please enter a value with a valid extension."));

        /*---------------------------------------------------------------------*/
        /*设置默认属性 */

        function isIP(strIP) {
            if (!strIP) return false;
            var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g //匹配IP地址的正则表达式
            if (re.test(strIP)) {
                if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) return true;
            }
            return false;
        }

        function checkDomain(nname) {
            var arr = new Array('.com', '.net', '.org', '.biz', '.coop', '.info', '.museum', '.name', '.pro', '.edu', '.gov', '.int', '.mil', '.ac', '.ad', '.ae', '.af', '.ag', '.ai', '.al', '.am', '.an', '.ao', '.aq', '.ar', '.as', '.at', '.au', '.aw', '.az', '.ba', '.bb', '.bd', '.be', '.bf', '.bg', '.bh', '.bi', '.bj', '.bm', '.bn', '.bo', '.br', '.bs', '.bt', '.bv', '.bw', '.by', '.bz', '.ca', '.cc', '.cd', '.cf', '.cg', '.ch', '.ci', '.ck', '.cl', '.cm', '.cn', '.co', '.cr', '.cu', '.cv', '.cx', '.cy', '.cz', '.de', '.dj', '.dk', '.dm', '.do', '.dz', '.ec', '.ee', '.eg', '.eh', '.er', '.es', '.et', '.fi', '.fj', '.fk', '.fm', '.fo', '.fr', '.ga', '.gd', '.ge', '.gf', '.gg', '.gh', '.gi', '.gl', '.gm', '.gn', '.gp', '.gq', '.gr', '.gs', '.gt', '.gu', '.gv', '.gy', '.hk', '.hm', '.hn', '.hr', '.ht', '.hu', '.id', '.ie', '.il', '.im', '.in', '.io', '.iq', '.ir', '.is', '.it', '.je', '.jm', '.jo', '.jp', '.ke', '.kg', '.kh', '.ki', '.km', '.kn', '.kp', '.kr', '.kw', '.ky', '.kz', '.la', '.lb', '.lc', '.li', '.lk', '.lr', '.ls', '.lt', '.lu', '.lv', '.ly', '.ma', '.mc', '.md', '.mg', '.mh', '.mk', '.ml', '.mm', '.mn', '.mo', '.mp', '.mq', '.mr', '.ms', '.mt', '.mu', '.mv', '.mw', '.mx', '.my', '.mz', '.na', '.nc', '.ne', '.nf', '.ng', '.ni', '.nl', '.no', '.np', '.nr', '.nu', '.nz', '.om', '.pa', '.pe', '.pf', '.pg', '.ph', '.pk', '.pl', '.pm', '.pn', '.pr', '.ps', '.pt', '.pw', '.py', '.qa', '.re', '.ro', '.rw', '.ru', '.sa', '.sb', '.sc', '.sd', '.se', '.sg', '.sh', '.si', '.sj', '.sk', '.sl', '.sm', '.sn', '.so', '.sr', '.st', '.sv', '.sy', '.sz', '.tc', '.td', '.tf', '.tg', '.th', '.tj', '.tk', '.tm', '.tn', '.to', '.tp', '.tr', '.tt', '.tv', '.tw', '.tz', '.ua', '.ug', '.uk', '.um', '.us', '.uy', '.uz', '.va', '.vc', '.ve', '.vg', '.vi', '.vn', '.vu', '.ws', '.wf', '.ye', '.yt', '.yu', '.za', '.zm', '.zw', '.me');

            var mai = nname;
            var val = true;

            var dot = mai.lastIndexOf(".");
            var dname = mai.substring(0, dot);
            var ext = mai.substring(dot, mai.length);

            if (dot > 2 && dot < 57) {
                for (var i = 0; i < arr.length; i++) {
                    if (ext == arr[i]) {
                        val = true;
                        break;
                    } else {
                        val = false;
                    }
                }
                if (val == false) {
                    return false;
                } else {
                    for (var j = 0; j < dname.length; j++) {
                        var dh = dname.charAt(j);
                        var hh = dh.charCodeAt(0);
                        if ((hh > 47 && hh < 59) || (hh > 64 && hh < 91) || (hh > 96 && hh < 123) || hh == 45 || hh == 46) {
                            if ((j == 0 || j == dname.length - 1) && hh == 45) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                }
            } else {
                return false;
            }

            return true;
        }

        // 字符验证       
        jQuery.validator.addMethod("stringCheck", function(value, element) {
            return this.optional(element) || (/^[\u0391-\uFFE5\w\W\s]+$/).test(value);
        }, "只能包括中文字、英文字母、数字和下划线");

        // 中文字两个字节       
        jQuery.validator.addMethod("byteRangeLength", function(value, element, param) {
            var length = value.length;
            for (var i = 0; i < value.length; i++) {
                if (value.charCodeAt(i) > 127) {
                    length++;
                }
            }
            return this.optional(element) || (length >= param[0] && length <= param[1]);
        }, "请确保输入的值在3-15个字节之间(一个中文字算2个字节)");

        // 身份证号码验证       
        jQuery.validator.addMethod("isIdCardNo", function(value, element) {
            return this.optional(element) || isIdCardNo(value);
        }, "请正确输入您的身份证号码");

        // 手机号码验证       
        jQuery.validator.addMethod("isMobile", function(value, element) {
            var length = value.length;
            var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            
            var result = this.optional(element) || (length == 11 && mobile.test(value));
            return this.optional(element) || (length == 11 && mobile.test(value));
        }, "请正确填写您的手机号码");

        // 电话号码验证       
        jQuery.validator.addMethod("isTel", function(value, element) {
            var tel = /^\d{3,4}-?\d{7,9}$/; //电话号码格式010-12345678   
            return this.optional(element) || (tel.test(value));
        }, "请正确填写您的电话号码");

        // 联系电话(手机/电话皆可)验证   
        jQuery.validator.addMethod("isPhone", function(value, element) {
            var length = value.length;
            var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            var tel = /^\d{3,4}-?\d{7,9}$/;

            return this.optional(element) || (tel.test(value) || mobile.test(value));

        }, "请正确填写您的联系电话");

        // 邮政编码验证       
        jQuery.validator.addMethod("isZipCode", function(value, element) {
            var tel = /^[0-9]{6}$/;
            return this.optional(element) || (tel.test(value));
        }, "请正确填写您的邮政编码");

        jQuery.validator.addMethod("isWebsite", function(value, element) {
            var website = /^((https?|ftp|file):\/\/)?[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
            return this.optional(element) || (website.test(value));
        }, "网址格式不正确");

        jQuery.validator.addMethod("url", function(value, element) {
            var website = /^((https?|ftp|file):\/\/)[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
            return this.optional(element) || (website.test(value));
        }, "网址格式不正确");

        jQuery.validator.addMethod("iPOrDomain", function(value, element) {
            return this.optional(element) || (isIP(value) || checkDomain(value));
        });

        jQuery.validator.addMethod("domain", function(value, element) {
            return this.optional(element) || checkDomain(value);
        });

        jQuery.validator.addMethod("ip", function(value, element) {
            return this.optional(element) || isIP(value);
        });


        jQuery.validator.addMethod("isPort", function(value, element) {
            var port = /^([0-9]|[1-9]\\d|[1-9]\\d{2}|[1-9]\\d{3}|[1-5]\\d{4}|6[0-4]\\d{3}|65[0-4]\\d{2}|655[0-2]\\d|6553[0-5])$/;
            return this.optional(element) || (port).test(value);
        }, "请输入正确的端口号");

        jQuery.validator.addMethod("notEqual", function(value, element, param) {
            var target = $(param).unbind(".validate-notEqual").bind("blur.validate-notEqual", function() {
                $(element).valid();
            });
            return value != target.val();
        });

        jQuery.validator.addMethod("more_ip", function(value, element) {
            var url_list = value.split("|");
            for (var i = 0; i < url_list.length; i++) {
                if (!isIP(url_list[i]) && !checkDomain(url_list[i])) {
                    return false;
                }
            }
            return true;
        });


        // 字符验证       
        jQuery.validator.addMethod("simple_string", function(value, element) {
            return this.optional(element) || /^[a-zA-Z]\w+$/.test(value);
        }, "只能包括英文字母、数字和下划线");


        jQuery.validator.addMethod("exclude_word", function(value, element, params){
            if(!this.optional(element) && params && params.length ){
                for(var i=0; i<params.length; i++){
                    if(element.value == params[i]){
                        return false; 
                    }  
                }
            }
            return true;
             
        }, "不能包含此词汇");

    }
});
