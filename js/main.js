let isSensorActive = true; // Status sensor aktif
let fetchInterval;

// Fungsi untuk mengambil data dari Firebase
async function fetchDataFromFirebase() {
  if (!isSensorActive) {
    document.getElementById("status").textContent =
      "Sensor mati, silahkan nyalakan kembali jika ingin mendeteksi.";
    document.getElementById("circle").style.backgroundColor = "gray";
    document.getElementById("circle").style.animation = "none";
    return;
  }

  const url =
    "https://deteksikebakaran-2214f-default-rtdb.asia-southeast1.firebasedatabase.app/sensor-data.json";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    updateUI(data);
  } catch (error) {
    console.error("Ada masalah dengan pengambilan data:", error);
  }
}

// Fungsi untuk memperbarui UI
function updateUI(data) {
  const statusElement = document.getElementById("status");
  const circleElement = document.getElementById("circle");

  if (data.smokeValue > 2000 && data.fireDetected) {
    statusElement.textContent =
      "Kebakaran terdeteksi! Segeralah evakuasi dari tempat!";
    circleElement.style.backgroundColor = "red";
    circleElement.style.animation = "breath 0.5s infinite";
  } else if (data.fireDetected) {
    statusElement.textContent = "Ada api! Hindari bahan yang mudah terbakar.";
    circleElement.style.backgroundColor = "orange";
    circleElement.style.animation = "breath 1s infinite";
  } else if (data.smokeValue > 2000) {
    statusElement.textContent =
      "Asap terdeteksi, cari sumbernya dan hati-hati!";
    circleElement.style.backgroundColor = "yellow";
    circleElement.style.animation = "breath 1.5s infinite";
  } else {
    statusElement.textContent = "Lingkungan aman.";
    circleElement.style.backgroundColor = "green";
    circleElement.style.animation = "breath 2s infinite";
  }
}

// Fungsi untuk toggle sensor
function toggleSensor() {
  isSensorActive = !isSensorActive;

  const button = document.getElementById("toggleSensorButton");
  if (isSensorActive) {
    button.textContent = "Matikan Sensor";
    fetchInterval = setInterval(fetchDataFromFirebase, 2000);
  } else {
    button.textContent = "Nyalakan Sensor";
    clearInterval(fetchInterval);
    document.getElementById("status").textContent =
      "Sensor mati, silahkan nyalakan kembali jika ingin mendeteksi.";
    document.getElementById("circle").style.backgroundColor = "gray";
    document.getElementById("circle").style.animation = "none";
  }
}

// Pasang event listener pada tombol
document
  .getElementById("toggleSensorButton")
  .addEventListener("click", toggleSensor);

// Mulai fetch data secara otomatis saat halaman dimuat
fetchInterval = setInterval(fetchDataFromFirebase, 2000);
