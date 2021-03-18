(function ($) {
    let authToken;
    let webViewInterface = window.nsWebViewInterface;

    webViewInterface.on('loadDataResponse', onDataLoaded);

    webViewInterface.on('authorized', authorizedEventHandler);
    webViewInterface.on('unauthorized', unauthorizedEventHandler);


    let enableOrderPicker = false;
    $(function () {
        $('#login-button').on('click', login);
        $('#toggler').on('click', toggleOrderPicker);
        webViewInterface.emit('loadData')
    });

    function login(e) {
        e.preventDefault();
        let login = $('#login').val();
        let password = $('#password').val();
        webViewInterface.emit('login', {login, password});
    }
    function toggleOrderPicker(e) {
        e.preventDefault();
        if (enableOrderPicker) {
            $('.toggler').removeClass('on').addClass('off');
            $('.toggler .toggle').html('Выкл');
        } else {
            $('.toggler').removeClass('off').addClass('on');
            $('.toggler .toggle').html('Вкл');
        }
        enableOrderPicker = !enableOrderPicker;
    }
    function addFilter(e) {
    }
    function removeFilter(e) {
    }

    //Events handlers
    function onDataLoaded(data) {
        $('#login').val(data.login);
        $('#password').val(data.password);
    }
    function authorizedEventHandler(data) {
        authToken = data.auth;
        $('#login').val('');
        $('#password').val('');
    }
    function unauthorizedEventHandler(data) {
        $('#password').val('');
    }
})(jQuery)
