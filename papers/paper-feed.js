async function fetchPaperMetadata(doi) {
    const apiUrl = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const title = data.message.title ? data.message.title[0] : "No title available";
        const abstract = data.message.abstract ? data.message.abstract : "No abstract available.";
        
        return { title, abstract, doi };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { title: "Error fetching data", abstract: "", doi };
    }
}

async function displayPapers() {
    const icuDois = [
        "10.1136/bmj.i1351",
        "https://doi.org/10.1186/s13054-017-1638-9",
        "10.1007/s00134-018-5425-0",
        "https://doi.org/10.1186/s13054-017-1800-4",
    ];
    const covidDois = [
        "https://doi.org/10.1016/S2213-2600(22)00127-8",
        "https://doi.org/10.1038/s41390-022-02052-5",
        "https://doi.org/10.1016/S2589-7500(22)00018-8",
        "https://doi.org/10.1136/bmjopen-2020-048124",
        "https://doi.org/10.1002/oby.23178",
        "https://doi.org/10.1016/S2665-9913(21)00104-1",
        "https://doi.org/10.1016/S2213-2600(21)00175-2",
        "https://doi.org/10.1016/S0140-6736(21)00677-2",
        "https://doi.org/10.1126/sciimmunol.abg9873",
        "https://doi.org/10.1016/S2213-2600(20)30559-2",
        "https://doi.org/10.1136/bmj.m3339",
        "https://doi.org/10.1136/bmj.m3249",
        "https://doi.org/10.1136/bmj.m1985"
    ];
    
    await displayPaperList(icuDois, "icu");
    await displayPaperList(covidDois, "covid");
}

async function displayPaperList(dois, containerId) {
    const container = document.getElementById(containerId);
    const papers = await Promise.all(dois.map(fetchPaperMetadata));
    
    papers.forEach(paper => {
        const paperDiv = document.createElement("div");
        paperDiv.innerHTML = `
            <h2>${paper.title}</h2>
            <p>${paper.abstract}</p>
            <a href="https://doi.org/${paper.doi}" target="_blank">Read More</a>
            <hr>
        `;
        container.appendChild(paperDiv);
    });
}

window.onload = displayPapers;