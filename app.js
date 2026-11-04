
let code1 = "";
let code2 = "";
let activeTarget = 0;
let scanTimer = null;
let processing = false;

// 容器分類：末尾3桁
const containers = {
    "091": "血ガス容器",
    "518": "PN2",
    "007": "尿コップ"
};

const input = document.getElementById("scannerInput");

// 読み取り対象を選択
function selectScan(target) {

    activeTarget = target;
    processing = false;

    clearTimeout(scanTimer);

    input.value = "";
    input.focus();

    document.getElementById("status").textContent =
        target === 1
        ? "① 検体ラベルを読み取ってください"
        : "② 容器ラベルを読み取ってください";
}

// バーコード入力を監視
input.addEventListener("input", function() {

    clearTimeout(scanTimer);

    // Enterを送信しないスキャナーにも対応
    if (input.value.length >= 11) {

        scanTimer = setTimeout(function() {
            processBarcode();
        }, 250);

    }
});

// Enterを送信するスキャナーにも対応
input.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {

        e.preventDefault();

        clearTimeout(scanTimer);
        processBarcode();
    }
});

// バーコード確定処理
function processBarcode() {

    if (activeTarget === 0 || processing) return;

    const barcode = input.value.trim();

    if (!/^\d{11}$/.test(barcode)) {

        document.getElementById("status").textContent =
            "読み取りエラー：11桁の数字ではありません";

        input.value = "";
        input.focus();
        return;
    }

    processing = true;

    // 末尾3桁を取得
    const code = barcode.slice(-3);

    // 分類を明示的に取得
    const containerName =
        Object.prototype.hasOwnProperty.call(containers, code)
        ? containers[code]
        : "対象外";

    if (activeTarget === 1) {

        code1 = code;

        document.getElementById("barcode1").innerHTML =
            "<strong>" + barcode + "</strong><br>" +
            "分類コード：" + code + "<br>" +
            "容器：" + containerName;

    } else {

        code2 = code;

        document.getElementById("barcode2").innerHTML =
            "<strong>" + barcode + "</strong><br>" +
            "分類コード：" + code + "<br>" +
            "容器：" + containerName;
    }

    activeTarget = 0;
    input.value = "";

    document.getElementById("status").textContent =
        "読み取り完了";

    if (code1 !== "" && code2 !== "") {
        judge();
    }
}

// 照合処理
function judge() {

    const result = document.getElementById("result");
    const area = document.getElementById("result-area");

    area.className = "";

    const valid1 =
        Object.prototype.hasOwnProperty.call(containers, code1);

    const valid2 =
        Object.prototype.hasOwnProperty.call(containers, code2);

    if (!valid1 || !valid2) {

        result.textContent = "対象外";
        area.classList.add("error");

        document.getElementById("status").textContent =
            "登録されていない分類コードです";

        beep();
        return;
    }

    if (code1 === code2) {

        result.textContent = "〇 一致";
        area.classList.add("success");

        document.getElementById("status").textContent =
            "照合完了：容器は一致しています";

    } else {

        result.textContent = "× 不一致";
        area.classList.add("error");

        document.getElementById("status").textContent =
            "警告：容器が一致しません！";

        beep();
    }
}

// 警告音
function beep() {

    try {

        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();

        osc.connect(ctx.destination);
        osc.frequency.value = 600;

        osc.start();
        osc.stop(ctx.currentTime + 0.5);

        osc.onended = () => ctx.close();

    } catch (e) {
        console.log(e);
    }
}

// リセット
function resetScan() {

    code1 = "";
    code2 = "";
    activeTarget = 0;
    processing = false;

    clearTimeout(scanTimer);

    document.getElementById("barcode1").textContent =
        "未読取";

    document.getElementById("barcode2").textContent =
        "未読取";

    document.getElementById("result").textContent =
        "照合待ち";

    document.getElementById("result-area").className = "";

    document.getElementById("status").textContent =
        "読み取り対象を選択してください";

    input.value = "";
}
