(function ($) {
    let webViewInterface;

    window.addEventListener("ns-bridge-ready", function(e) {
        webViewInterface = e.detail || window.nsWebViewBridge;

        webViewInterface.on('loadDataResponse', onDataLoaded);
        webViewInterface.on('authorized', authorizedEventHandler);
        webViewInterface.on('unauthorized', unauthorizedEventHandler);
        webViewInterface.on('updateOrderToggle', updateToggleEventHandler);

        webViewInterface.emit('loadData');
    });

    let enableOrderPicker = false;
    let filtersList;
    $(function () {
        $('#login-button').on('click', login);
        $('#orderToggle').on('click', toggleOrderPicker);
    });

    function login(e) {
        e.preventDefault();
        let login = $('#login').val();
        let password = $('#password').val();
        webViewInterface.emit('login', {login, password});
        $('.form-loader').show();
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

        let htmlText = '';
        filtersList.forEach(f => {
            htmlText += `<div data-filter-text="${f}" class="filter-line">`;
            htmlText += `<span class="label">${f}</span>`;
            htmlText += '<button class="remove-btn">х</button></div>';
        });
        $('.filter-list').append(htmlText);
    }
    function authorizedEventHandler(data) {
        $('#login').val('');
        $('#password').val('');
        $('.screen.sign-in').hide();
        $('.screen.main').show();
        $('.form-loader').hide();
    }
    function unauthorizedEventHandler(data) {
        $('#password').val('');
        $('.form-loader').hide();
        $('.form-error').show();
        setTimeout(() => {
            $('.form-error').hide();
        }, 1500);
    }
    function updateToggleEventHandler(data) {
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
