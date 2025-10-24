document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("tipsContainer");
    const filter = document.getElementById("industryFilter");

    let tips = [];
    try {
        const res = await fetch("data/resume-tips.json");
        tips = await res.json();
        renderTips(tips);
    } catch (err) {
        console.error("❌ Error loading JSON:", err);
        container.innerHTML = "<p>⚠️ Failed to load tips.</p>";
        return;
    }

    filter.addEventListener("change", (e) => {
        const selected = e.target.value.trim().toLowerCase();
        console.log("Selected:", selected); // pre debugovanie
        const filtered =
            selected === "all"
                ? tips
                : tips.filter(t => t.category.trim().toLowerCase() === selected);

        console.log("Filtered tips:", filtered); // uvidíš v konzole
        renderTips(filtered);
    });

    function renderTips(list) {
        if (!list.length) {
            container.innerHTML = "<p>No tips found for this category.</p>";
            return;
        }

        container.innerHTML = list.map(t => `
            <div class="card">
                <h3>${t.title}</h3>
                <p>${t.description}</p>
                <small><b>Category:</b> ${t.category}</small><br>
                <a href="${t.link}" target="_blank" class="btn small">Read more</a>
            </div>
        `).join("");
    }
});
