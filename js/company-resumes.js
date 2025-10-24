document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("resumesContainer");
    const filter = document.getElementById("industryFilter");
    console.log("Script loaded");
    console.log("Fetching resumes from: ", window.location.origin + "/data/company-resumes.json");

    let resumes = [];
    try {
        const res = await fetch("data/company-resumes.json");
        resumes = await res.json();
        console.log("Loaded resumes:", resumes);
        renderResumes(resumes);
    } catch (err) {
        container.innerHTML = "<p>Failed to load resumes.</p>";
    }

    filter.addEventListener("change", e => {
        const selected = e.target.value;
        const filtered = selected === "All" ? resumes : resumes.filter(r => r.industry === selected);
        renderResumes(filtered);
    });

    function renderResumes(list) {
        container.innerHTML = list.map(r => `
      <div class="card">
        <h3>${r.title}</h3>
        <p><b>Company:</b> ${r.company}</p>
        <p><b>Industry:</b> ${r.industry}</p>
        <a href="${r.link}" target="_blank" class="btn small">View Example</a>
      </div>
    `).join("");
    }
    console.log("Loaded resumes:", resumes);

});
