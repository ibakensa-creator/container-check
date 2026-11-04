
let code1 = "";
let code2 = "";
let activeTarget = 0;

const containers = {
    "091": "血ガス容器",
    "518": "PN2",
    "007": "尿コップ"
};

const input = document.getElementById("scannerInput");

function selectScan(target) {

    activeTarget = target;

    document.getElementById("status").textContent =
        "バーコード" + target + "を読み取ってください";

    input.value = "";
    input.focus();
}

// Enterキーで読み取り確定
input.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {

        e.preventDefault();

        if (activeTarget === 0) {
            document.getElementById("status").textContent =
                "先に読み取り対象を選択してください";
            return;
        }

        let barcode = input.value.trim();

        barcode = barcode.replace(/^[Aa]/, "");
        barcode = barcode.replace(/[Aa]$/, "");

        const code = barcode.slice(-3);

        if (activeTarget === 1) {

            code1 = code;

            document.getElementById("barcode1").innerHTML =
                "① " + barcode + "<br>容器：" +
                (containers[code] || "対象外");

        } else {

            code2 = code;

            document.getElementById("barcode2").innerHTML =
                "② " + barcode + "<br>容器：" +
                (containers[code] || "対象外");
        }

        activeTarget = 0;
        input.value = "";

        document.getElementById("status").textContent =
            "読み取り完了";

        if (code1 && code2) {
            judge();
        }

    }

});

// 照合
function judge() {

    const result = document.getElementById("result");

    if (!(code1 in containers) ||
        !(code2 in containers)) {

        result.textContent = "対象外";
        result.style.color = "red";
        document.body.style.backgroundColor = "#ffcccc";
        return;
    }

    if (code1 === code2) {

        result.textContent = "〇";
        result.style.color = "green";
        document.body.style.backgroundColor = "#ccffcc";

    } else {

        result.textContent = "×";
        result.style.color = "red";
        document.body.style.backgroundColor = "#ffcccc";

        beep();
    }
}

// 不一致時の警告音
function beep() {

    const ctx = new (window.AudioContext ||
                     window.webkitAudioContext)();

    const osc = ctx.createOscillator();

    osc.connect(ctx.destination);
    osc.frequency.value = 600;
    osc.start();

    setTimeout(() => {
        osc.stop();
        ctx.close();
    }, 500);
}

// 初期化
function resetScan() {

    code1 = "";
    code2 = "";
    activeTarget = 0;

    document.getElementById("barcode1").textContent =
        "① 未読取";

    document.getElementById("barcode2").textContent =
        "② 未読取";

    document.getElementById("result").textContent =
        "照合待ち";

    document.getElementById("result").style.color =
        "black";

    document.getElementById("status").textContent =
        "読み取り対象を選択してください";

    document.body.style.backgroundColor = "white";

    input.value = "";
}
