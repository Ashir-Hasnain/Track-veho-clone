// variable 
const form = document.querySelector('#tracking-form');
const trackingInput = document.querySelector('#tracking-number');
const trackButton = form?.querySelector('.btn');


// checking the tracking btn working or not
if (form && trackingInput && trackButton) {
    function validate() {
        const hasValue = trackingInput.value.trim() !== '';
        trackButton.disabled = !hasValue;
        trackButton.classList.toggle('enabled', hasValue);
    }

    trackingInput.addEventListener('input', validate);
    validate();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const enteredTrackingNumber = trackingInput.value.trim();
        if (!enteredTrackingNumber) return;

        try {
            const response = await fetch('./data/shipments.json');
            const data = await response.json();
            const validTrackingNumber = String(data.shipmentFacts?.overview?.trackingNumber || '').trim();

            if (enteredTrackingNumber !== validTrackingNumber) {
                trackingInput.setCustomValidity('Please enter a valid tracking number.');
                // alert("Please enter a valid tracking number.")
                trackingInput.reportValidity();
                return;
            }

            trackingInput.setCustomValidity('');
            const detailUrl = new URL('View-more-details.html', window.location.href);
            detailUrl.searchParams.set('trackingNumber', enteredTrackingNumber);
            window.location.href = detailUrl.toString();
        } catch (error) {
            console.error('Unable to validate tracking number:', error);
            trackingInput.setCustomValidity('Unable to validate tracking number right now.');
            trackingInput.reportValidity();
        }
    });
}