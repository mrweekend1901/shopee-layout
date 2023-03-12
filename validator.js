function Validator(options) {

    var rulesSelectors = {};

    // Hàm thực hiện validate
    function Validate(inputElement, rule) {
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        // Lấy rule của các selector
        var rules = rulesSelectors[rule.selector]
        // Lặp qua từng rule có lỗi thì dừng
        for(let i = 0; i< rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if(errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }

        return !errorMessage;
    }

    // Lấy element
    var formElement = document.querySelector(options.form);
    if(formElement){
        //Khi submit form
        formElement.onsubmit = function(e) {
            
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rule và validate()
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = Validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });

            if(isFormValid) {
                // Submit với JS
                if (typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]');

                    var formValues = Array.from(enableInputs).reduce(function (values, input){
                        return (values[input.name] = input.value) && values;
                    }, {});

                    options.onSubmit(formValues);
                    // Submit với hành vi mặc dịnh
                } else {
                    formElement.submit();
                }
            }

        }

        options.rules.forEach(function(rule){
            // Lấy tất cả rule
            if(Array.isArray(rulesSelectors[rule.selector])){
                rulesSelectors[rule.selector].push(rule.test);
            } else {
                rulesSelectors[rule.selector] = [rule.test]
            }

            var inputElement = formElement.querySelector(rule.selector);
            
            if(inputElement) {
                //Khi blur
                inputElement.onblur =function() {
                    Validate(inputElement, rule);
                }

                // Khi nhập
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }
}

Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập đủ thông tin!'
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Vui lòng nhập Email!'
        }
    }
}

Validator.minLenght = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || 'Vui lòng nhập tối thiểu 6 ký tự'
        }
    }
}

Validator.isConfirm = function(selector, getConfirmVale, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmVale() ? undefined : message || 'Vui lòng nhập đúng dữ liệu!'
        }
    }
}
