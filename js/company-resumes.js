document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("resumesContainer");
    const filter = document.getElementById("industryFilter");
    const favoritesBtn = document.getElementById("resumeFavoritesBtn");
    const favoritesCount = document.getElementById("resumeFavoritesCount");

    let resumes = [];
    let showFavoritesOnly = false;
    let favorites = JSON.parse(localStorage.getItem("favoriteResumes")) || [];

    try {
        const res = await fetch("data/company-resumes.json");
        resumes = await res.json();
        renderResumes(resumes);
        updateFavoritesCount();
    } catch (err) {
        container.innerHTML = "<p>Failed to load resumes.</p>";
    }

    filter.addEventListener("change", (e) => {
        const selected = e.target.value;
        const filtered =
            selected === "All"
                ? resumes
                : resumes.filter((r) => r.industry === selected);
        renderResumes(filtered);
    });

    favoritesBtn.addEventListener("click", () => {
        showFavoritesOnly = !showFavoritesOnly;
        favoritesBtn.innerHTML = showFavoritesOnly
            ? '<i class="far fa-star"></i> Show All Resumes'
            : '<i class="far fa-star"></i> Show Favorite Resumes Only';
        renderResumes(resumes);
    });

    function renderResumes(list) {
        const visibleResumes = showFavoritesOnly
            ? list.filter((r) => favorites.includes(r.title))
            : list;

        container.innerHTML = visibleResumes
            .map(
                (r) => `
        <div class="card tip-card" data-id="${r.title}">
          <span class="resume-favorite-icon ${
                    favorites.includes(r.title) ? "active" : ""
                }" title="Add to favorites">
            <i class="${
                    favorites.includes(r.title) ? "fas" : "far"
                } fa-heart"></i>
          </span>
          <h3>${r.title}</h3>
          <p><b>Company:</b> ${r.company}</p>
          <p><b>Industry:</b> ${r.industry}</p>
          <a href="${r.link}" target="_blank" class="btn small">View Example</a>
        </div>
      `
            )
            .join("");

        document.querySelectorAll(".resume-favorite-icon").forEach((icon) => {
            icon.addEventListener("click", (e) => {
                const card = e.currentTarget.closest(".card");
                const resumeId = card.getAttribute("data-id");
                toggleFavorite(resumeId, e.currentTarget);
            });
        });
    }

    // Toggle favorite
    function toggleFavorite(resumeId, iconElement) {
        const index = favorites.indexOf(resumeId);
        const heart = iconElement.querySelector("i");

        if (index === -1) {
            favorites.push(resumeId);
            heart.classList.remove("far");
            heart.classList.add("fas");
            iconElement.classList.add("active");
        } else {
            favorites.splice(index, 1);
            heart.classList.remove("fas");
            heart.classList.add("far");
            iconElement.classList.remove("active");
        }

        localStorage.setItem("favoriteResumes", JSON.stringify(favorites));
        updateFavoritesCount();

        if (showFavoritesOnly) renderResumes(resumes);
    }

    function updateFavoritesCount() {
        favoritesCount.textContent = favorites.length;
    }
});
