document.addEventListener("DOMContentLoaded", () => {

    /* ---------- ELEMENTS ---------- */
    const video = document.getElementById("video");
    const startBtn = document.getElementById("startCamBtn");
    const stopBtn = document.getElementById("stopCamBtn");
    const stressBox = document.getElementById("stress-result");
    const adviceBox = document.getElementById("stress-advice");
    const avgBox = document.getElementById("avg-stress");
    const lastCheckBox = document.getElementById("last-check");

    /* ---------- STATE ---------- */
    let stream = null;
    let timer = null;
    let readings = [];
    let running = false;

    /* ---------- SAFETY CHECK ---------- */
    if (!video || !startBtn || !stopBtn || !stressBox) {
        console.error("Required HTML elements missing");
        return;
    }

    /* ---------- BUTTON EVENTS ---------- */
    startBtn.addEventListener("click", startCamera);
    stopBtn.addEventListener("click", stopCamera);

    /* ---------- START CAMERA ---------- */
    async function startCamera() {
        if (running) return;
        running = true;
        readings = [];

        if (stressBox) stressBox.innerText = "Measuring...";
        if (adviceBox) adviceBox.innerText = "--";

        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            await video.play(); // 🔥 VERY IMPORTANT

            startBtn.disabled = true;
            stopBtn.disabled = false;

            timer = setInterval(captureFrame, 1000);
            setTimeout(showFinalResult, 30000);

        } catch (err) {
            alert("Camera access denied or unavailable");
            console.error(err);
            running = false;
        }
    }

    /* ---------- CAPTURE FRAME ---------- */
    function captureFrame() {
        if (!running || !video.videoWidth) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
            try {
                const fd = new FormData();
                fd.append("frame", blob, "frame.jpg");

                const res = await fetch("/predict", {
                    method: "POST",
                    body: fd
                });

                const data = await res.json();
                let value = Math.round(data.stress_index * 100);
                value = Math.max(0, Math.min(100, value));
                readings.push(value);

            } catch (e) {
                console.error("Predict error:", e);
            }
        }, "image/jpeg");
    }

    /* ---------- FINAL RESULT ---------- */
    function showFinalResult() {
        stopCamera();

        if (readings.length === 0) {
            if (stressBox) stressBox.innerText = "No data";
            return;
        }

        const avgRaw = Math.round(
            readings.reduce((a, b) => a + b, 0) / readings.length
        );

        const stress = normalizeStress(avgRaw);

        stressBox.innerText = stress + "%";
    adviceBox.innerText = getSuggestion(stress);

    applyColor(stress);

    updateAverage(stress);
    }

    /* ---------- STOP CAMERA ---------- */
    function stopCamera() {
        running = false;

        if (timer) clearInterval(timer);

        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        }

        startBtn.disabled = false;
        stopBtn.disabled = true;
    }

    /* ---------- STRESS LOGIC ---------- */
    function normalizeStress(v) {
    // v is 0–100 raw

    if (v < 20) {
        return 20;          // smiling / calm
    } 
    else if (v < 50) {
        return 40;          // normal
    } 
    else if (v < 75) {
        return 65;          // tensed
    } 
    else {
        return 85;          // very tensed
    }
}


    function getSuggestion(v) {
        if (v <= 40) return "You look relaxed 😄 Keep it up!";
        if (v <= 80) return "You seem tense 😟 Try relaxing your jaw & shoulders.";
        return "High stress 😣 Take slow deep breaths 🧘‍♀️";
    }

    function applyColor(v) {
        stressBox.className = "";
        if (v <= 40) stressBox.classList.add("low-stress");
        else if (v <= 80) stressBox.classList.add("mild-stress");
        else stressBox.classList.add("high-stress");
    }

    /* ---------- AVG + LAST CHECK ---------- */
    function updateAverage(v) {

    // safety: invalid value आला तर skip
    if (typeof v !== "number" || isNaN(v)) {
        console.warn("Invalid stress value:", v);
        return;
    }

    let history = JSON.parse(localStorage.getItem("history")) || [];

    // ensure only numbers are stored
    history = history.filter(x => typeof x === "number" && !isNaN(x));

    history.push(v);

    if (history.length > 50) {
        history = history.slice(-50);
    }

    // 🛡️ safety check
    if (history.length === 0) {
        avgBox.innerText = "--";
        lastCheckBox.innerText = "--";
        return;
    }

    const sum = history.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / history.length);

    avgBox.innerText = avg + "%";
    lastCheckBox.innerText = new Date().toLocaleString();

    localStorage.setItem("history", JSON.stringify(history));
}


});

