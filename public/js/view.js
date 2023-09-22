function edit() {
    var currentList = window.prompt("sometext","defaultText");
    if (!(currentList == null || currentList == "")) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/nameEdit', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ name: currentList}));
        xhr.onreadystatechange = function() {
            window.location.href = window.location.href;
        }
    }
}

function refreshList() {
    $refreshButton = document.getElementById("refreshButton");

    $refreshButton.disabled = true;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/list', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {

            // Enable submit.
            $refreshButton.disabled = false;

            // Show message based on the response.
            if (xhr.status === 200) {
                window.location.href = window.location.href;
            } else {
                window.alert('Failed');
            }
        }
    };

    xhr.send(JSON.stringify({ name: 'placeholder'}));
}

function saveas() {
    var $saveas = document.getElementById('saveas');
    $saveas.disabled = true;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/saveas', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {

            $saveas.disabled = false;

            // Show message based on the response.
            if (xhr.status === 200) {
                // Hide message.
                window.alert("Success");
            } else {
                window.alert("Failure");
            }
        }
    };

    xhr.send(JSON.stringify({ name: document.getElementById("currentList").innerHTML }));
}