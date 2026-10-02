let code1 = "";
let code2 = "";

const containers = {
    "091":"血ガス容器",
    "518":"PN2",
    "007":"尿コップ"
};

function startScan1(){
    scanBarcode(1);
}

function startScan2(){
    scanBarcode(2);
}

function scanBarcode(target){

    const html5QrCode =
        new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },

        function(decodedText){

            html5QrCode.stop();

            let containerNo =
                decodedText.slice(-3);

            if(target === 1){

                code1 = containerNo;

                document.getElementById(
                    "barcode1"
                ).innerHTML =
                    "① " +
                    containerNo +
                    " (" +
                    (containers[containerNo] || "対象外")
                    + ")";

            }else{

                code2 = containerNo;

                document.getElementById(
                    "barcode2"
                ).innerHTML =
                    "② " +
                    containerNo +
                    " (" +
                    (containers[containerNo] || "対象外")
                    + ")";

                judge();
            }

        }
    );
}

function judge(){

    const result =
        document.getElementById("result");

    if(!(code1 in containers)
       || !(code2 in containers)){

        result.innerHTML = "対象外";
        result.style.color = "red";

        return;
    }

    if(code1 === code2){

        result.innerHTML =
            "〇";

        result.style.color =
            "green";

        document.body.style.backgroundColor =
            "#d4ffd4";

    }else{

        result.innerHTML =
            "×";

        result.style.color =
            "red";

        document.body.style.backgroundColor =
            "#ffd4d4";

        beep();
    }
}

function beep(){

    const audio =
        new Audio(
            "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
        );

    audio.play();
}