
let allSpots = [];

fetch('tour_spots_with_xy.json')
  .then(res => res.json())
  .then(data => {
    allSpots = data;
    const regionMap = {};

    data.forEach(d => {
      const region = extractRegion(d.name);
      if (!regionMap[region]) {
        regionMap[region] = [];
      }
      regionMap[region].push(d);
    });

    const regions = Object.keys(regionMap).sort();
    const regionSelect = document.getElementById("regionSelect");
    regions.forEach(region => {
      const opt = document.createElement("option");
      opt.value = region;
      opt.textContent = region;
      regionSelect.appendChild(opt);
    });

    regionSelect.addEventListener("change", () => {
      const selected = regionSelect.value;
      const spotSelect = document.getElementById("spotSelect");
      spotSelect.innerHTML = '<option value="">-- 관광지 선택 --</option>';
      regionMap[selected].forEach(s => {
        const opt = document.createElement("option");
        opt.value = JSON.stringify(s); // s.name, s.nx, s.ny 등 포함
        opt.textContent = s.name;
        spotSelect.appendChild(opt);
      });
      spotSelect.disabled = false;
    });
  });

function extractRegion(name) {
  const match = name.match(/^\((.*?)\)/);
  return match ? match[1] : "기타";
}

function searchWeather(type = "current") {
  const region = document.getElementById("regionSelect").value;
  const spotSelect = document.getElementById("spotSelect");
  const selectedData = JSON.parse(spotSelect.value || "{}");

  if (!region || !selectedData.name) {
    alert("지역과 관광지를 모두 선택해주세요.");
    return;
  }

  const name = encodeURIComponent(selectedData.name);
  const nx = selectedData.nx;
  const ny = selectedData.ny;

  if (type === "current") {
    window.location.href = `forecast.html?name=${name}&nx=${nx}&ny=${ny}`;
  } else if (type === "forecast") {
    window.location.href = `detail_forecast.html?name=${name}&nx=${nx}&ny=${ny}`;
  }
}
