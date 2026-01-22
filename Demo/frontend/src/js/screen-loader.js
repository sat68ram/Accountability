async function loadScreen(path, subtitle) {
  const container = document.getElementById("screen-container");
  const subtitleEl = document.getElementById("screen-subtitle");

  if (subtitleEl && subtitle) subtitleEl.textContent = subtitle;

  const html = await fetch(path).then(r => r.text());
  container.innerHTML = html;
}

const SCREEN_MAP = {
    "company-vision": {
        url: "../screens/company-vision.html",
        title: "Company Vision · Portfolio Overview"
    },
    "revenue": {
        url: "../screens/revenue-layout.html",
        title: "Revenue Layout · Components"
    },
    "profitability": {
        url: "../screens/profitability.html",
        title: "Profitability Layout · Components"
    },
    "projects": {
        url: "../screens/projects.html",
        title: "Projects Layout · Components"
    },
    "customer-happiness": {
        url: "../screens/customer-hapiness.html",
        title: "Customer Happiness · Experience & Delivery"
    },
    "risks": {
        url: "../screens/risks.html",
        title: "Risks · Portfolio & Owners"
    },
    "human-capital": {
        url: "../screens/human-capital.html",
        title: "Human Capital · Workforce & Talent"
    },
    "supply-chain": {
        url: "../screens/supply-chain.html",
        title: "Supply Chain · Visibility & Risk"
    }
};

function loadScreenByName(screenKey) {
	console.error(screenKey);
    const screen = SCREEN_MAP[screenKey];

    if (!screen) {
        console.error("Unknown screen:", screenKey);
        return;
    }

    loadScreen(screen.url, screen.title);
}

const screen = document.getElementById("screen").textContent.trim();
console.log("Screen:", screen);

loadScreenByName(screen);





