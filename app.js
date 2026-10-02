let code1 = "";
let code2 = "";

const containers = {
    "091": "血ガス容器",
    "518": "PN2",
    "007": "尿コップ"
};

function startScan1() {
    scanBarcode(1);
}

function startScan2() {
    scanBarcode(2);
}

function scanBarcode(target) {

    const qr = new Html5Qrcode("reader");

    qr.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },

        function(decodedText) {

            qr.stop();

            let code = decodedText.slice(-3);

            if (target === 1) {

                code1 = code;

                document.getElementById("barcode1").innerHTML =
                    "① " + code + " " +
                    (containers[code] || "対象外");

            } else {

                code2 = code;

                document.getElementById("barcode2").innerHTML =
                    "② " + code + " " +
                    (containers[code] || "対象外");

                judge();
            }
        },

        function(error) {
        }
    );
}

function judge() {

    const result =
        document.getElementById("result");

    if (!(code1 in containers) ||
        !(code2 in containers)) {

        result.innerHTML = "対象外";
        result.style.color = "red";
        return;
    }

    if (code1 === code2) {

        result.innerHTML = "〇";
        result.style.color = "green";

        document.body.style.backgroundColor =
            "#ccffcc";

    } else {

        result.innerHTML = "×";
        result.style.color = "red";

        document.body.style.backgroundColor =
            "#ffcccc";

        beep();
    }
}

function beep() {

    const ctx =
        new (window.AudioContext ||
        window.webkitAudioContext)();

    const osc =
        ctx.createOscillator();

    osc.connect(ctx.destination);

    osc.frequency.value = 600;

    osc.start();

    setTimeout(function() {
        osc.stop();
    }, 300);
}