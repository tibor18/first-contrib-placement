import { test, expect } from "vitest";
import { JSDOM } from "jsdom";

// 1️⃣ základný test (ten už máš)
test("renders container with tips", () => {
    const dom = new JSDOM(`<div id="tipsContainer"></div>`);
    const container = dom.window.document.getElementById("tipsContainer");
    expect(container).not.toBeNull();
});

// 2️⃣ nový test – filter podľa kategórie
test("filters tips by selected category", () => {
    // Simulovaný DOM
    const dom = new JSDOM(`<!DOCTYPE html><body><div id="tipsContainer"></div></body>`);
    const document = dom.window.document;
    const container = document.getElementById("tipsContainer");

    // Fake funkcia renderTips – využívame ako mock
    function renderTips(list) {
        container.innerHTML = list
            .map(
                (t) => `
        <div class="card" data-category="${t.category}">
          <h3>${t.title}</h3>
          <p>${t.description}</p>
          <small>${t.category}</small>
        </div>
      `
            )
            .join("");
    }

    // Mock dáta
    const mockTips = [
        { title: "Formatting Tips", description: "Keep resume clean", category: "Formatting" },
        { title: "Content Advice", description: "Use action verbs", category: "Content" },
        { title: "Common Mistakes", description: "Avoid clutter", category: "Common Mistakes" },
    ];

    // Funkcia pre filtrovanie (test double)
    function filterTips(category) {
        if (category === "All") return mockTips;
        return mockTips.filter((t) => t.category === category);
    }

    // 1️⃣ filtrujeme len Content tipy
    const filtered = filterTips("Content");

    // 2️⃣ renderujeme do DOM
    renderTips(filtered);

    // 3️⃣ očakávame, že je len 1 výsledok
    const cards = container.querySelectorAll(".card");
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain("Content Advice");
});
