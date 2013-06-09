define(function(require, exports, module) {
    return function($) {
        require('./bootstrap')($);
        require('./jquery-metadata')($);
        require('./jquery-validate')($);
        require('./jquery-validate-password')($);
        require('./zxcvbn-validate-password')($);
        require('./additional-methods')($);
        require('./iso8601');
        require('./jquery-autocomplete')($);
        require('./jquery-dateformat')($);
        require('./jquery-layout')($);
        require('./jquery-pager')($);
        require('./jquery-ui')($);
        require('./jquery-cookie')($);

        /**
         *  datetimepicker 插件加载 
         */
        require('./jquery-ui-slideraccess')($);
        //require('./jquery-ui-timepicker-addon')($);

        require('./select2')($);
        //$.validator.setDefaults({onkeyup:false});
    }
});
