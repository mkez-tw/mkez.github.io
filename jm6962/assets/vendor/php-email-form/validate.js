/**
 * PHP Email Form Validation - v2.3
 * URL: https://bootstrapmade.com/php-email-form/
 * Author: BootstrapMade.com
 */
!(function($) {
    "use strict";

    $('form.php-email-form').submit(function(e) {
        e.preventDefault();

        var f = $(this).find('.form-group'),
            ferror = false,
            emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

        f.children('input').each(function() { // run all inputs

            var i = $(this); // current input
            var rule = i.attr('data-rule');

            if (rule !== undefined) {
                var ierror = false; // error flag for current input
                var pos = rule.indexOf(':', 0);
                if (pos >= 0) {
                    var exp = rule.substr(pos + 1, rule.length);
                    rule = rule.substr(0, pos);
                } else {
                    rule = rule.substr(pos + 1, rule.length);
                }

                switch (rule) {
                    case 'required':
                        if (i.val() === '') {
                            ferror = ierror = true;
                        }
                        break;

                    case 'minlen':
                        if (i.val().length < parseInt(exp)) {
                            ferror = ierror = true;
                        }
                        break;

                    case 'email':
                        if (!emailExp.test(i.val())) {
                            ferror = ierror = true;
                        }
                        break;

                    case 'checked':
                        if (!i.is(':checked')) {
                            ferror = ierror = true;
                        }
                        break;

                    case 'regexp':
                        exp = new RegExp(exp);
                        if (!exp.test(i.val())) {
                            ferror = ierror = true;
                        }
                        break;
                }
                i.next('.validate').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
            }
        });
        f.children('textarea').each(function() { // run all inputs

            var i = $(this); // current input
            var rule = i.attr('data-rule');

            if (rule !== undefined) {
                var ierror = false; // error flag for current input
                var pos = rule.indexOf(':', 0);
                if (pos >= 0) {
                    var exp = rule.substr(pos + 1, rule.length);
                    rule = rule.substr(0, pos);
                } else {
                    rule = rule.substr(pos + 1, rule.length);
                }

                switch (rule) {
                    case 'required':
                        if (i.val() === '') {
                            ferror = ierror = true;
                        }
                        break;

                    case 'minlen':
                        if (i.val().length < parseInt(exp)) {
                            ferror = ierror = true;
                        }
                        break;
                }
                i.next('.validate').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
            }
        });
        if (ferror) return false;

        var this_form = $(this);
        var action = $(this).attr('action');

        if (!action) {
            this_form.find('.loading').slideUp();
            this_form.find('.error-message').slideDown().html('The form action property is not set!');
            return false;
        }

        this_form.find('.sent-message').slideUp();
        this_form.find('.error-message').slideUp();
        this_form.find('.loading').slideDown();

        if ($(this).data('recaptcha-site-key')) {
            var recaptcha_site_key = $(this).data('recaptcha-site-key');
            grecaptcha.ready(function() {
                grecaptcha.execute(recaptcha_site_key, { action: 'php_email_form_submit' }).then(function(token) {
                    php_email_form_submit(this_form, action, this_form.serialize() + '&recaptcha-response=' + token);
                });
            });
        } else {
            php_email_form_submit(this_form, action, this_form.serialize());
        }

        return true;
    });

    function php_email_form_submit(this_form, action, data) {
        var data = {
            'entry.1483798300': $('#name').val(), //姓名
            'entry.1015402315': $('#phone').val(), //手機
            'entry.1617940911': $('#line_id').val(), //LINE ID
            'entry.897099057': $('#email').val(), //email
            'entry.2125075950': $('#county').val(), //居住地區 (縣市)
            'entry.334157699': $('#contact_time').val(), //方便連絡時間
            'entry.113780485': $('#message').val(), //詢問內容
        };

        console.log(data);

        $.ajax({
            type: 'POST',
            url: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSc4bSyoPAV0eK3DlGIt0tWtSu-8ZqQ5Wd4mbWSTvj1uqDBKrQ/formResponse',
            contentType: 'application/json',
            dataType: 'jsonp',
            async: false,
            data: data,

        }).always(function() {
            // alert("已經成功送出表單，感謝您的填寫");
            // header('Content-Type:application/javascript');
            console.log(data);
            this_form.find('.loading').slideUp();
            this_form.find('.sent-message').slideDown();
            this_form.find("input:not(input[type=submit]), textarea").val('');
        });

        /*
                $.ajax({
                    type: "POST",
                    url: 'https://docs.google.com/forms/d/e/1FAIpQLSdOhgFJG3-J0ECu9TXBi6XIIkmDCSsySqL2o6Y42hL9IdJbbA/formResponse',
                    contentType: 'application/json',
                    dataType: 'jsonp',
                    async: false,
                    data: data,
                    data: data,
                    timeout: 40000
                }).done(function(msg) {
                    if (msg.trim() == 'OK') {
                        this_form.find('.loading').slideUp();
                        this_form.find('.sent-message').slideDown();
                        this_form.find("input:not(input[type=submit]), textarea").val('');
                    } else {
                        this_form.find('.loading').slideUp();
                        if (!msg) {
                            msg = 'Form submission failed and no error message returned from: ' + action + '<br>';
                        }
                        this_form.find('.error-message').slideDown().html(msg);
                    }
                }).fail(function(data) {
                    console.log(data);
                    var error_msg = "Form submission failed!<br>";
                    if (data.statusText || data.status) {
                        error_msg += 'Status:';
                        if (data.statusText) {
                            error_msg += ' ' + data.statusText;
                        }
                        if (data.status) {
                            error_msg += ' ' + data.status;
                        }
                        error_msg += '<br>';
                    }
                    if (data.responseText) {
                        error_msg += data.responseText;
                    }

                    this_form.find('.loading').slideUp();
                    this_form.find('.error-message').slideDown().html(error_msg);
                });
        */
    }

})(jQuery);