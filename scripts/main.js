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
        $('#addFilterModal').on('click', () => {
            $('.add-filter-modal, .add-filter-backdrop').show();
        });
        $('#addFilter').on('click', addFilter);
        $('#cancel').on('click', () => {
            $('.add-filter-modal, .add-filter-backdrop').hide();
            $("#filterInput").val('');
        });
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
        $('.add-filter-modal, .add-filter-backdrop').hide();
        let $filterInput = $("#filterInput");
        let value = $filterInput.val();
        $filterInput.val('');
        value = value.trim().toLowerCase();
        if(value.length < 3) return;
        filtersList.push(value);
        webViewInterface.emit('updateFilters', {filters: filtersList.join(';')});
        let htmlText = '';
        filtersList.forEach(f => {
            htmlText += `<div data-filter-text="${f}" class="filter-line">`;
            htmlText += `<span class="label">${f}</span>`;
            htmlText += '<button class="remove-btn">Удалить</button></div>';
        });
        $('.filter-list').html(htmlText);
        $('.remove-btn').on('click', removeFilter);
    }
    function removeFilter(e) {
        let filterText = $(e.target).parent().attr('data-filter-text');
        filtersList =  filtersList.filter(word => word !== filterText);
        webViewInterface.emit('updateFilters', {filters: filtersList.join(';')});
        let htmlText = '';
        filtersList.forEach(f => {
            htmlText += `<div data-filter-text="${f}" class="filter-line">`;
            htmlText += `<span class="label">${f}</span>`;
            htmlText += '<button class="remove-btn">Удалить</button></div>';
        });
        $('.filter-list').html(htmlText);
        $('.remove-btn').on('click', removeFilter);
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
            htmlText += '<button class="remove-btn">Удалить</button></div>';
        });
        $('.filter-list').append(htmlText);
        $('.remove-btn').on('click', removeFilter);
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
        if (!enableOrderPicker) {
            $('.toggler').removeClass('on').addClass('off');
            $('.toggler .toggle').html('Выкл');
        } else {
            $('.toggler').removeClass('off').addClass('on');
            $('.toggler .toggle').html('Вкл');
        }
    }
})(jQuery)
