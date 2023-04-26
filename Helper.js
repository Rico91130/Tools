const helper = (function () {

    var _toastLoaded = false;

    function toast(type, errTitle, errMsg, errDelay) {
        if (_toastLoaded) {

            vNotify[type]({
                "text": errMsg,
                "title": errTitle,
                "visibleDuration": errDelay
            });

        } else {

            _toastLoaded = true;

            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://rico91130.github.io/Tools/dist/vanilla-notify/vanilla-notify.css';
            link.media = 'all';
            head.appendChild(link);

            var _thisArgs = arguments;
            helper.loadScripts("Tools/dist/vanilla-notify/vanilla-notify.js").then(() => {
                helper.toast.apply(null, _thisArgs);
            });
        }
    }

    function toastError(...args) {
        toast.apply(null, ["error"].concat(args));
    }

    function loadScripts() {
        var urls = Array.prototype.slice.call(arguments);
        var loaded = 0;

        return new Promise(function (resolve, reject) {
            function onScriptLoad() {
                loaded++;

                if (loaded === urls.length) {
                    resolve();
                }
            }

            for (var i = 0; i < urls.length; i++) {
                var script = document.createElement('script');
                if (urls[i].indexOf("http") == -1)
                    urls[i] = "https://rico91130.github.io/" + urls[i];
                script.src = urls[i] + "?" + (new Date()).getTime();
                script.async = true;
                script.onload = onScriptLoad;
                script.onerror = reject;
                document.head.appendChild(script);
            }
        });
    }

    /* Convertit une string date au format GT en date JS */
    function GTDate2JSDate(GTDate) {
        var [dateValues, timeValues] = GTDate.split(' ');
        var [day, month, year] = dateValues.split('-');
        var [hours, minutes, seconds] = timeValues.split(':');
        return new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    }

    /* Convertit une date JS en date GT */
    function JSDate2GTDate(JSDate) {
        return JSDate.getFullYear() + "-" + ("" + (JSDate.getMonth() + 1)).padStart(2, "0") + "-" + ("" + JSDate.getDate()).padStart(2, "0")
    }

    function downloadObjectAsCSV(exportObj, exportName) {
        var dataStr = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(exportObj);
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function buildQuery(url, params, defaultVal) {

        var replaceURL = url;
        Object.keys(params).forEach(key => {
            replaceURL = replaceURL.replaceAll("%%" + key + "%%", params[key])
        });

        if (defaultVal == null)
            defaultVal = "";

        return replaceURL.replace(/%%(.*?)%%/ig, defaultVal);
    }

    return {
        toast: toast,
        toastError: toastError,
        loadScripts: loadScripts,
        buildQuery: buildQuery,
        downloadObjectAsCSV: downloadObjectAsCSV,
        JSDate2GTDate: JSDate2GTDate,
        GTDate2JSDate: GTDate2JSDate
    }

})()
