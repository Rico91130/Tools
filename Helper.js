const helper = (function () {

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
        loadScripts : loadScripts,
        buildQuery: buildQuery,
        downloadObjectAsCSV: downloadObjectAsCSV,
        JSDate2GTDate: JSDate2GTDate,
        GTDate2JSDate: GTDate2JSDate
    }

})()
