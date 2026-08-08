document.addEventListener("DOMContentLoaded", () => {
  fetchTrackingData();
});

async function fetchTrackingData() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const trackingNumber = urlParams.get('trackingNumber') || '';

    const response = await fetch('./data/shipments.json');
    const data = await response.json();

    const validTrackingNumber = String(data.shipmentFacts?.overview?.trackingNumber || '').trim();

    if (!trackingNumber || trackingNumber !== validTrackingNumber) {
      window.location.replace('index.html');
      return;
    }

    renderTimeline(data.travelHistory || []);
    renderTables(data.shipmentFacts);
  } catch (error) {
    console.error('Error fetching JSON data:', error);
  }
}

function renderTimeline(history) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  container.innerHTML = history.map(group => `
    <div class="timeline-group">
      <div class="date-row">${group.date}</div>
      ${group.events.map(event => {
        const locationHtml = event.location ? `<div class="location">${event.location}</div>` : '';
        return `
          <div class="timeline-item">
            <div class="time">${event.time}</div>
            <div class="status-dot-container">
              <div class="dot ${event.isDelivered ? 'delivered' : ''}"></div>
            </div>
            <div class="status-desc">${event.isDelivered ? `<strong>${event.status}</strong>` : event.status}</div>
            ${locationHtml}
          </div>
        `;
      }).join('')}
    </div>
  `).join('');
}

function renderTables(facts) {
  const overviewTable = document.getElementById('table-overview');
  const servicesTable = document.getElementById('table-services');
  const packageTable = document.getElementById('table-package');

  const makeRow = (label, value) => value ? `<tr><td class="label">${label}</td><td class="value">${value}</td></tr>` : '';

  if (overviewTable) {
    overviewTable.innerHTML = [
      makeRow('TRACKING NUMBER', facts.overview.trackingNumber),
      makeRow('SHIP DATE', facts.overview.shipDate),
      makeRow('STANDARD TRANSIT', facts.overview.standardTransit),
      makeRow('DELIVERED', facts.overview.delivered)
    ].join('');
  }

  if (servicesTable) {
    servicesTable.innerHTML = [
      makeRow('SERVICE', facts.services.service),
      makeRow('TERMS', facts.services.terms)
    ].join('');
  }

  if (packageTable) {
    packageTable.innerHTML = [
      makeRow('WEIGHT', facts.packageDetails.weight),
      makeRow('DIMENSIONS', facts.packageDetails.dimensions),
      makeRow('TOTAL PIECES', facts.packageDetails.totalPieces),
      makeRow('PACKAGING', facts.packageDetails.packaging)
    ].join('');
  }
}