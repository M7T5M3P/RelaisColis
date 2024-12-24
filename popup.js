import { analyzeData } from './utils/parser.js';
let clients = [];
let originalFile = null;

const storedData = localStorage.getItem('clientsData');
if (storedData) {
  clients = JSON.parse(storedData);
  populateClientList();
}

console.log('Popup script loaded');

function populateClientList() {
  const clientList = document.getElementById('clientList');
  clientList.innerHTML = clients
    .map(client => {
      const style = client.selected ? 'background-color: #d3d3d3;' : '';
      return `<li data-id="${client.id}" style="${style}">${client.name}</li>`;
    })
    .join('');
}

function standardizePhoneNumber(phoneNumber) {
  if (phoneNumber.includes(" ")) {
    phoneNumber = phoneNumber.replace(/ /g, "");
  }
  if (phoneNumber.startsWith("+33")) {
    phoneNumber = phoneNumber.replace("+33", "0");
  }
  if (phoneNumber.startsWith("00")) {
    phoneNumber = phoneNumber.replace("00", "0");
  }
  return phoneNumber;
}

document.getElementById('fileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) {
    console.error("No file selected");
    return; // Exit if no file is selected
  }
  originalFile = file;
  try {
    const text = await file.text();
    clients = analyzeData(text);
    localStorage.setItem('clientsData', JSON.stringify(clients));
    populateClientList();
  } catch (error) {
    console.error("Error reading file:", error);
  }
});

document.getElementById('clientList').addEventListener('click', (event) => {
  const clientId = event.target.dataset.id;
  const selectedClient = clients.find(client => client.id === parseInt(clientId));

  selectedClient.selected = !selectedClient.selected;
  event.target.style.backgroundColor = selectedClient.selected ? '#d3d3d3' : '';

  if (selectedClient.selected) {
    clients = clients.filter(client => client.id !== selectedClient.id);
    clients.push(selectedClient);
  }

  localStorage.setItem('clientsData', JSON.stringify(clients));

  const [firstName, ...lastNameParts] = selectedClient.data["buyer-name"].split(" ");
  selectedClient.data["firstName"] = firstName;
  selectedClient.data["lastName"] = lastNameParts.join(" ");
  selectedClient.data["email"] = "livreokaz@yahoo.com";
  selectedClient.data["buyer-phone-number"] = standardizePhoneNumber(selectedClient.data["buyer-phone-number"]);

  if (selectedClient.data["firstName"] === "" && selectedClient.data["lastName"] !== "") {
    selectedClient.data["firstName"] = selectedClient.data["lastName"];
  } else if (selectedClient.data["firstName"] !== "" && selectedClient.data["lastName"] === "") {
    selectedClient.data["lastName"] = selectedClient.data["firstName"];
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "fillForm",
      clientData: selectedClient.data,
    }, (response) => {
      console.log("Response from content script:", response);
    });
  });

  populateClientList();
});