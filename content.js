chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillForm") {
      const clientData = request.clientData;

      clearFormFields();

      const mappings = {
        "firstName": "#address_recipient_firstName",
        "lastName": "#address_recipient_lastName",
        "ship-address-1": "#address_recipient_street",
        "ship-postal-code": "#address_recipient_postcode",
        "ship-city": "#address_recipient_city",
        "buyer-email": "#address_recipient_email",
        "buyer-phone-number": "#address_recipient_mobilePhoneNumber",
      };
  
      Object.entries(mappings).forEach(([key, selector]) => {
        const field = document.querySelector(selector);
        if (field) {
          console.log(`Filling field ${selector} with value:`, clientData[key]);
          field.value = clientData[key] || "";
        } else {
          console.warn(`Field with selector ${selector} not found.`);
        }
      });
  
      sendResponse({ status: "Form filled", clientData });
    }
  });
  
function clearFormFields() {
    const formElements = document.querySelectorAll('input, select, textarea');

    formElements.forEach((element) => {
        element.value = '';
        if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = false;
        }
    });
}