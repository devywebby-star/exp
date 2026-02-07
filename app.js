const listings = [
  {
    type: "buyer",
    company: "BlueWave Manufacturing",
    material: "Aluminum ingots",
    quantity: "80 MT monthly",
    location: "Rotterdam, NL",
    notes: "Looking for ISO-certified supplier with 30-day terms."
  },
  {
    type: "seller",
    company: "Kappa Mining Co.",
    material: "Copper concentrate",
    quantity: "200 MT available",
    location: "Antofagasta, CL",
    notes: "Export-ready with SGS certification."
  },
  {
    type: "buyer",
    company: "Solace Textiles",
    material: "Organic cotton",
    quantity: "35 MT quarterly",
    location: "Ahmedabad, IN",
    notes: "Requires GOTS certification."
  },
  {
    type: "seller",
    company: "NorthBridge Polymers",
    material: "Recycled HDPE pellets",
    quantity: "120 MT monthly",
    location: "Houston, US",
    notes: "Flexible on shipping terms, FOB available."
  }
];

const listingGrid = document.getElementById("listingGrid");
const filterButtons = document.querySelectorAll(".filter");
const searchInput = document.getElementById("searchInput");
const listingForm = document.getElementById("listingForm");
const quickMatchForm = document.getElementById("quickMatchForm");

const renderListings = (items) => {
  if (!listingGrid) {
    return;
  }

  listingGrid.innerHTML = "";

  if (items.length === 0) {
    listingGrid.innerHTML = "<p class=\"helper\">No listings match your search yet.</p>";
    return;
  }

  items.forEach((listing) => {
    const card = document.createElement("div");
    card.className = "listing-card";

    card.innerHTML = `
      <span class="tag ${listing.type}">${listing.type === "buyer" ? "Buyer" : "Seller"}</span>
      <h3>${listing.material}</h3>
      <p><strong>${listing.company}</strong></p>
      <p>${listing.notes}</p>
      <div class="meta">
        <span>${listing.quantity}</span>
        <span>${listing.location}</span>
      </div>
      <button>Connect</button>
    `;

    listingGrid.appendChild(card);
  });
};

const getActiveFilter = () => {
  const activeFilter = document.querySelector(".filter.active");
  return activeFilter ? activeFilter.dataset.filter : "all";
};

const applyFilters = () => {
  if (!listingGrid || !searchInput) {
    return;
  }

  const filter = getActiveFilter();
  const query = searchInput.value.trim().toLowerCase();

  const filtered = listings.filter((listing) => {
    const matchesType = filter === "all" || listing.type === filter;
    const matchesQuery =
      listing.company.toLowerCase().includes(query) ||
      listing.material.toLowerCase().includes(query) ||
      listing.location.toLowerCase().includes(query);

    return matchesType && matchesQuery;
  });

  renderListings(filtered);
};

if (filterButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      applyFilters();
    });
  });
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

if (listingForm) {
  listingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(listingForm);
    const newListing = {
      type: formData.get("type"),
      company: formData.get("company"),
      material: formData.get("material"),
      quantity: formData.get("quantity"),
      location: formData.get("location"),
      notes: formData.get("notes") || "New listing posted on RawLink."
    };

    listings.unshift(newListing);
    listingForm.reset();
    applyFilters();
    window.location.hash = "#market";
  });
}

if (quickMatchForm) {
  quickMatchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(quickMatchForm);
    const quickListing = {
      type: "buyer",
      company: "QuickMatch Request",
      material: formData.get("material"),
      quantity: formData.get("quantity"),
      location: formData.get("location"),
      notes: "New buyer request from QuickMatch."
    };

    listings.unshift(quickListing);
    quickMatchForm.reset();
    applyFilters();
    window.location.hash = "#market";
  });
}

renderListings(listings);
