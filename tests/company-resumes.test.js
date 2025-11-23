import { test, expect } from "vitest";

// 1️⃣ základný test — že súbor vôbec funguje
test("company resumes JSON loads correctly", () => {
    expect(true).toBe(true);
});

// 2️⃣ test načítania a spracovania JSON dát (fake dáta)
test("renders resumes by industry", () => {
    // Fake JSON dáta — ako v súbore company-resumes.json
    const mockResumes = [
        { title: "Software Engineer Resume", company: "Google", industry: "Tech" },
        { title: "Financial Analyst Resume", company: "Goldman Sachs", industry: "Finance" },
        { title: "Nurse Resume", company: "Mayo Clinic", industry: "Healthcare" },
    ];

    // Mock funkcia — simuluje renderovanie do DOM
    function renderResumes(list) {
        return list.map(r => `<div class="card" data-industry="${r.industry}">${r.title}</div>`).join("");
    }

    // Mock filter (test double) — simuluje výber podľa kategórie
    function filterResumes(industry) {
        if (industry === "All") return mockResumes;
        return mockResumes.filter(r => r.industry === industry);
    }

    // 1️⃣ filtrujeme len "Tech" odvetvie
    const filtered = filterResumes("Tech");

    // 2️⃣ renderujeme HTML
    const output = renderResumes(filtered);

    // 3️⃣ testujeme výsledok
    expect(filtered.length).toBe(1);
    expect(output).toContain("Software Engineer Resume");
    expect(output).not.toContain("Financial Analyst Resume");
});
