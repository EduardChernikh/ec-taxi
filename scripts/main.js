(function ($) {
    let webViewInterface = window.nsWebViewInterface;

    webViewInterface.on('loadDataResponse', onDataLoaded);

    webViewInterface.on('authorized', authorizedEventHandler);
    webViewInterface.on('unauthorized', unauthorizedEventHandler);

    webViewInterface.on('updateOrderToggle', updateToggleEventHandler);
    webViewInterface.on('bodyHtml', function (data) {
        let html = '<p>';

        data.forEach(o => {
            html+= o.address + '<br>';
        });

        html+= '</p>'

        $('.filter-list').html(html);
    });


    let enableOrderPicker = false;
    let filtersList;
    $(function () {
        $('#login-button').on('click', login);
        $('#orderToggle').on('click', toggleOrderPicker);
        $('#geoToggle').on('click', toggleGeoPicker);
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
        webViewInterface.emit('updateOrderToggle', {enabled: enableOrderPicker});
    }

    function toggleGeoPicker(e) {

    }

    function addFilter(e) {
        // TODO: hide modal window
        // let value = $("#filterInput").val();
        // $("#filterInput").val('');
        // value = value.trim();
        // if(value.length < 3) return;
        // filtersList.push(value);
        webViewInterface.emit('updateFilters', {filters: filtersList.join(';')});
    }

    function removeFilter(e) {
    }

    //Events handlers
    function onDataLoaded(data) {
        $('#login').val(data.login);
        $('#password').val(data.password);
        if (data.filters.length === 0) {
            filtersList = [];
        } else {
            filtersList = data.filters.split(';');
        }
    }

    function authorizedEventHandler(data) {
        $('#login').val('');
        $('#password').val('');
        $('.screen.sign-in').hide();
        $('.screen.main').show();
    }

    function unauthorizedEventHandler(data) {
        $('#password').val('');
    }

    function  updateToggleEventHandler(data) {
        enableOrderPicker = data.enabled;
        if (enableOrderPicker) {
            $('.toggler').removeClass('on').addClass('off');
            $('.toggler .toggle').html('Выкл');
        } else {
            $('.toggler').removeClass('off').addClass('on');
            $('.toggler .toggle').html('Вкл');
        }
    }
})(jQuery)
