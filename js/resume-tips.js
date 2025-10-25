document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("tipsContainer");
    const filter = document.getElementById("industryFilter");
    const favoritesBtn = document.getElementById("resumeFavoritesBtn");
    const favoritesCount = document.getElementById("resumeFavoritesCount");

    let tips = [];
    let showFavoritesOnly = false;
    let favorites = JSON.parse(localStorage.getItem("favoriteTips")) || [];

    try {
        const res = await fetch("data/resume-tips.json");
        tips = await res.json();
        renderTips(tips);
        updateFavoritesCount();
    } catch (err) {
        container.innerHTML = "<p>Failed to load tips.</p>";
    }

    filter.addEventListener("change", (e) => {
        const selected = e.target.value;
        const filtered =
            selected === "All"
                ? tips
                : tips.filter((t) => t.category === selected);
        renderTips(filtered);
    });

    favoritesBtn.addEventListener("click", () => {
        showFavoritesOnly = !showFavoritesOnly;
        favoritesBtn.innerHTML = showFavoritesOnly
            ? '<i class="far fa-star"></i> Show All Tips'
            : '<i class="far fa-star"></i> Show Favorite Tips Only';
        renderTips(tips);
    });

    function renderTips(list) {
        let visibleTips = showFavoritesOnly
            ? list.filter((t) => favorites.includes(t.title))
            : list;

        container.innerHTML = visibleTips
            .map(
                (t) => `
        <div class="card tip-card" data-id="${t.title}">
          <span class="resume-favorite-icon ${
                    favorites.includes(t.title) ? "active" : ""
                }" title="Add to favorites">
            <i class="${
                    favorites.includes(t.title) ? "fas" : "far"
                } fa-heart"></i>
          </span>
          <h3>${t.title}</h3>
          <p>${t.description}</p>
          <small><b>Category:</b> ${t.category}</small><br>
          <a href="${t.link}" target="_blank" class="btn small">Read more</a>
        </div>
      `
            )
            .join("");

        document.querySelectorAll(".resume-favorite-icon").forEach((icon) => {
            icon.addEventListener("click", (e) => {
                const card = e.currentTarget.closest(".card");
                const tipId = card.getAttribute("data-id");
                toggleFavorite(tipId, e.currentTarget);
            });
        });
    }

    function toggleFavorite(tipId, iconElement) {
        const index = favorites.indexOf(tipId);
        const heart = iconElement.querySelector("i");

        if (index === -1) {
            favorites.push(tipId);
            heart.classList.remove("far");
            heart.classList.add("fas");
            iconElement.classList.add("active");
        } else {
            favorites.splice(index, 1);
            heart.classList.remove("fas");
            heart.classList.add("far");
            iconElement.classList.remove("active");
        }

        localStorage.setItem("favoriteTips", JSON.stringify(favorites));
        updateFavoritesCount();

        if (showFavoritesOnly) renderTips(tips);
    }

    function updateFavoritesCount() {
        favoritesCount.textContent = favorites.length;
    }

// Vitest compatibility – safe export
    if (typeof module !== "undefined" && typeof renderTips === "function") {
        module.exports = { renderTips };
    }


});
