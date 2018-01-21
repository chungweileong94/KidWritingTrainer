let cnv;
let stroke_color;
let stroke_weight;
let isLoading = false;

function setup() {
    cnv = createCanvas(500, 500);
    cnv.parent("canvas-wrapper");

    //color selection
    $(".color-selection").click(function () {
        switch ($(this).attr('id')) {
            case "black":
                stroke_color = color(0, 0, 0);
                break;
            case "red":
                stroke_color = color(206, 64, 64);
                break;
            case "green":
                stroke_color = color(45, 120, 11);
                break;
            case "blue":
                stroke_color = color(71, 99, 192);
                break;
        }
    });

    //clear button
    $("#clear-button").click(function () { clear_value = 0; });

    //done button
    $("#done-button").click(function () {
        isLoading = true;
        $("#loading-screen").fadeIn();
        let blob = cnv.canvas.toBlob();

        $.ajax({
            url: "https://southcentralus.api.cognitive.microsoft.com/vision/v1.0/recognizeText?handwriting=true",
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "54621321be954b69b563250c84908be8");
            },
            type: "POST",
            data: blob,
            processData: false
        }).done(function (data, textStatus, jqXHR) {
            let operationLocation = jqXHR.getResponseHeader("Operation-Location");

            // Perform the second REST API call and get the response.
            setTimeout(() => {
                $.ajax({
                    url: operationLocation,
                    beforeSend: function (xhrObj) {
                        xhrObj.setRequestHeader("Content-Type", "application/json");
                        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "54621321be954b69b563250c84908be8");
                    },
                    type: "GET",
                }).done(function (data, textStatus, jqXHR) {
                    $("#loading-screen").fadeOut();
                    alert(data.recognitionResult.lines[0].text);
                    isLoading = false;
                });
            }, 10000);
        });
    });

    stroke_color = color(0, 0, 0);
    stroke_weight = 3;
    background(150);
}

let clear_value = 0;
function draw() {
    if (clear_value <= 1) {
        noStroke();
        fill(255);
        ellipse(0, 0, lerp(0, 1500, clear_value), lerp(0, 1500, clear_value));
        clear_value += .1;
        if (clear_value > 1) background(255);
    }
}

function mouseDragged() {
    if (clear_value <= 1 || isDropdownOpen() || isLoading) return;

    strokeWeight(stroke_weight);
    stroke(stroke_color);
    line(mouseX, mouseY, pmouseX, pmouseY);
    return false;
}

function mouseClicked() {
    if (clear_value <= 1 || isDropdownOpen() || isLoading) return;

    strokeWeight(stroke_weight);
    stroke(stroke_color);
    ellipse(mouseX, mouseY, 1, 1);
    return false;
}

function isDropdownOpen() {
    let result = false;

    $(".dropdown-content").each(function (i) {
        if ($(this).css("display") !== "none") {
            result = true;
        }
    });

    return result;
}

function makeBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

HTMLCanvasElement.prototype.toBlob = function (type) {
    var dataURL = this.toDataURL(type),
        binary = atob(dataURL.substr(dataURL.indexOf(',') + 1)),
        i = binary.length,
        view = new Uint8Array(i);

    while (i--) {
        view[i] = binary.charCodeAt(i);
    }

    return new Blob([view]);
};