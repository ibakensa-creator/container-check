
let code1 = "";
let code2 = "";
let activeTarget = 0;

// 容器分類
const containers = {
    "091": "血ガス容器",
    "518": "PN2",
    "007": "尿コップ"
};

const input = document.getElementById("scannerInput");
const form = document.getElementById("scanForm");

// 読み取り対象を選択
function selectScan(target) {

    activeTarget = target;

    const name = target === 1
        ? "検体ラベル①"
        : "容器ラベル②";

    document.getElementById("status").textContent =
        name + "をスキャンしてください";

    input.value = "";
    input.focus();
}

// Enterキーで読み取り確定
form.addEventListener("submit", function(e) {

    e.preventDefault();

    if (activeTarget === 0) {
        document.getElementById("status").textContent =
            "先に読み取りボタンを押してください";
        return;
    }

    const barcode = input.value.trim();

    // 11桁の数字か確認
    if (!/^\d{11}$/.test(barcode)) {

        document.getElementById("status").textContent =
            "読み取りエラー：11桁の数字ではありません";

        input.value = "";
        input.focus();
        return;
    }

    // 末尾3桁を取得
    const code = barcode.slice(-3);

    // ①検体ラベル
    if (activeTarget === 1) {

        code1 = code;

        document.getElementById("barcode1").innerHTML =
            '<strong>' + barcode + '</strong><br>' +
            (containers[code] || "対象外");

    }

    // ②容器ラベル
    else {

        code2 = code;

        document.getElementById("barcode2").innerHTML =
            '<strong>' + barcode + '</strong><br>' +
            (containers[code] || "対象外");

    }

    activeTarget = 0;
    input.value = "";

    // 両方読み取ったら照合
    if (code1 !== "" && code2 !== "") {

        judge();

    } else {

        document.getElementById("status").textContent =
            "読み取り完了。次のバーコードを選択してください";

    }

});

// 照合処理
function judge() {

    const result = document.getElementById("result");
    const resultArea = document.getElementById("result-area");

    resultArea.className = "";

    // 登録されていないバーコード
    if (!(code1 in containers) ||
        !(code2 in containers)) {

        result.textContent = "対象外";
        resultArea.classList.add("error");

        document.getElementById("status").textContent =
            "登録されていない容器です";

        beep();
        return;
    }

    // 一致
    if (code1 === code2) {

        result.textContent = "〇 一致";
        resultArea.classList.add("success");

        document.getElementById("status").textContent =
            "照合完了：容器は一致しています";

    }

    // 不一致
    else {

        result.textContent = "× 不一致";
        resultArea.classList.add("error");

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
        console.log("警告音を再生できません", e);
    }

}

// リセット
function resetScan() {

    code1 = "";
    code2 = "";
    activeTarget = 0;

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
