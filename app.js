
let code1 = "";
let code2 = "";
let activeTarget = 0;
let scanTimer = null;
let processing = false;

const containers = {
    "091": "血ガス容器",
    "518": "PN2",
    "007": "尿コップ"
};

const input = document.getElementById("scannerInput");

// 全角数字を半角に変換
function normalizeBarcode(value) {
    return value
        .normalize("NFKC")
        .replace(/\s/g, "")
        .replace(/^[Aa]|[Aa]$/g, "");
}

// 読み取り対象選択
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

// 入力を監視
input.addEventListener("input", function() {

    clearTimeout(scanTimer);

    const barcode = normalizeBarcode(input.value);

    // 11桁になったら少し待って確定
    if (barcode.length >= 11) {

        scanTimer = setTimeout(function() {
            processBarcode();
        }, 500);
    }
});

// Enterにも対応
input.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {
        e.preventDefault();
        clearTimeout(scanTimer);
        processBarcode();
    }
});

// バーコード確定
function processBarcode() {

    if (activeTarget === 0 || processing) return;

    const barcode = normalizeBarcode(input.value);

    if (!/^\d{11}$/.test(barcode)) {

        document.getElementById("status").textContent =
            "読み取りエラー：11桁の半角数字に変換できません";

        input.value = "";
        input.focus();
        return;
    }

    processing = true;

    const code = barcode.slice(-3);

    const name = Object.prototype.hasOwnProperty.call(
        containers, code
    ) ? containers[code] : "対象外";

    if (activeTarget === 1) {

        code1 = code;

        document.getElementById("barcode1").innerHTML =
            "<strong>" + barcode + "</strong><br>" +
            "分類コード：" + code + "<br>" +
            "容器：" + name;

    } else {

        code2 = code;

        document.getElementById("barcode2").innerHTML =
            "<strong>" + barcode + "</strong><br>" +
            "分類コード：" + code + "<br>" +
            "容器：" + name;
    }

    activeTarget = 0;
    input.value = "";

    if (code1 && code2) {
        judge();
    } else {
        document.getElementById("status").textContent =
            "読み取り完了。次のバーコードを選択してください";
    }
}

// 照合
function judge() {

    const result = document.getElementById("result");
    const area = document.getElementById("result-area");

    area.className = "";

    const valid1 = Object.prototype.hasOwnProperty.call(
        containers, code1
    );

    const valid2 = Object.prototype.hasOwnProperty.call(
        containers, code2
    );

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
            "照合完了：一致しています";

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

    document.getElementById("barcode1").textContent = "未読取";
    document.getElementById("barcode2").textContent = "未読取";
    document.getElementById("result").textContent = "照合待ち";
    document.getElementById("result-area").className = "";
    document.getElementById("status").textContent =
        "読み取り対象を選択してください";

    input.value = "";
}
