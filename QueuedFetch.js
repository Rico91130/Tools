var queuedFetch = (function () {

    var f = checkQueue.bind(this);

    setInterval(f, 100);

    const MAX_PARALLEL_CALL = 3;
    const MAX_CALL_PER_SECOND = 3;

    var seconds = {};
    var queue = [];
    var activeCall = 0;

    function queueSize() {
        return queue.length;
    }

    function activeConnection() {
        return activeCall;
    }

    function queueRequest(os, f1, f2) {

        if (!Array.isArray(os)) {
            os = [os];
        }

        /* Création d'un contexte d'exécution multirequêtes autoréférencé */
        var context = {"queries" : [], "callbackFunctionOnComplete" : f1, "callbackFunctionOnResponse" : f2};

        os.forEach(o => context.queries.push({"query" : o, "retries" : 0, "done" : false, "response" : null}));
        context.queries.forEach(q => {
                q.context = context;
            });

        /* Ajout des requetes */
        context.queries.forEach(q => queue.push(q));
    }


    function onPromiseCompleteOrFailure() {
        activeCall--;
    }

    function checkQueue() {

        secondToCheck = Math.floor(Date.now() / 1000);
        if (seconds[secondToCheck] === undefined)
            seconds[secondToCheck] = 0;

        if (queue.length && activeCall <= MAX_PARALLEL_CALL && seconds[secondToCheck] <= MAX_CALL_PER_SECOND) {

            seconds[secondToCheck]++;

            let item = queue.shift();
            if (!item) {
                return;
            }
 
            activeCall++;

            fetch(item.query.url, {"headers": item.query.headers})
                .then(res => res.json())
                .then(response => {
                    onPromiseCompleteOrFailure();

                    item.response = response;
                    item.done = true;

                    try {
                        if (item.context.callbackFunctionOnResponse != null)
                            item.context.callbackFunctionOnResponse(item);

                        if (item.context.callbackFunctionOnComplete && item.context.queries.filter(q => q.done).length == item.context.queries.length) {
                            item.context.callbackFunctionOnComplete(item.context.queries);
                        }
                    } catch(error) {
                        console.error('queuedFetch post-processing error for ' + item.query.url, error);
                    }

                })
                .catch(error => {
                    onPromiseCompleteOrFailure();
                    console.error('queuedFetch pre-processing error for ' + item.query.url, error);
                    if (++item.retries <= 3)
                        queue.push(item);
                })
        }
    }

    return {
        getQueueSize: queueSize,
        addRequest: queueRequest,
        getActiveConnection: activeConnection
    }
    
})()
