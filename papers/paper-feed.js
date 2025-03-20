async function fetchPaperMetadata(doi) {
    const apiUrl = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const title = data.message.title ? data.message.title[0] : "";
        let abstract = data.message.abstract ? data.message.abstract : "";
        abstract = abstract.length > 1000 ? abstract.substring(0, 1000) + "..." : abstract;
        let authors = data.message.author ? data.message.author.map(a => `${a.given} ${a.family}`).join(", ") : "";
        authors = authors.length > 300 ? authors.substring(0, 300) + "..." : authors;
        const publicationDate = data.message.published ? data.message.published["date-parts"][0].join("-") : "";

        return { title, abstract, authors, publicationDate, doi };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { title: "", abstract: "", authors: "", publicationDate: "", doi };
    }
}

async function displayPapers() {
    const icuDois = [
        "10.1111/anae.16599",
        "10.1056/NEJMoa2404360",
        "10.1111/anae.16314",
        "10.1164/rccm.202401-0101CP",
        "10.1111/1467-9566.13708",
        "10.1016/j.bja.2020.06.048",
        "10.1001/jama.2018.17121",
        "10.1007/s00134-018-5425-0",
        "10.1186/s13054-017-1638-9",
        "10.1186/s13054-017-1800-4",
        "10.1136/bmj.i1351"
    ];
    const covidDois = [
        "10.1183/23120541.00474-2024",
        "10.1016/S1470-2045(24)00107-4",
        "10.1038/s41590-024-01778-0",
        "10.1038/s41467-023-42205-6",
        "10.1016/S2213-2600(23)00262-X",
        "10.1111/1467-9566.13708",
        "10.1016/S2589-7500(23)00051-1",
        "10.1177/1751143721105222",
        "10.1371/journal.pmed.1004086",
        "10.1016/j.ebiom.2022.104402",
        "10.1111/anae.15826",
        "10.1016/S2213-2600(22)00127-8",
        "10.1038/s41390-022-02052-5",
        "10.1016/S0140-6736(22)00383-X",
        "10.1016/S2589-7500(22)00018-8",
        "10.1136/bmjopen-2020-048124",
        "10.1016/S0140-6736(21)02754-9",
        "10.1002/oby.23178",
        "10.1016/S2213-2600(21)00383-0",
        "10.1016/S0140-6736(21)01786-4",
        "10.1016/S0140-6736(21)00799-6",
        "10.1016/S2665-9913(21)00104-1",
        "10.1016/S2213-2600(21)00175-2",
        "10.1016/S0140-6736(21)00677-2",
        "10.1126/sciimmunol.abg9873",
        "10.1016/S2213-2600(20)30559-2",
        "10.1136/bmj.m3339",
        "10.1136/bmj.m3249",
        "10.1136/bmj.m1985"
    ];

    await displayPaperList(icuDois, "icu");
    await displayPaperList(covidDois, "covid");
}

async function displayPaperList(dois, containerId) {
    const container = document.getElementById(containerId);

    for (const doi of dois) {
        const paper = await fetchPaperMetadata(doi);
        const paperDiv = document.createElement("div");
        paperDiv.innerHTML = `
            <h2>${paper.title}</h2>
            <p><strong>Authors:</strong> ${paper.authors}</p>
            <p><strong>Publication Date:</strong> ${paper.publicationDate}</p>
            <p>${paper.abstract}</p>
            <a href="https://doi.org/${paper.doi}" target="_blank">Go to publication</a>
            <hr>
        `;
        container.appendChild(paperDiv);
    }
}

window.onload = displayPapers;