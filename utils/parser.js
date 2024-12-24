export async function fetchAndParseTxt(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(line => line.trim());
}

export function convertTxtToXml(data) {
    const parser = new DOMParser();
    const xmlString = `<clients>${data.map(line => `<client>${line}</client>`).join('')}</clients>`;
    return parser.parseFromString(xmlString, "application/xml");
}

export function analyzeData(txtData) {
    const rows = txtData.split("\n").map(row => row.trim()).filter(row => row.length > 0);
    const headers = rows[0].split("\t").map(header => header.trim());
    const dataRows = rows.slice(1);

    const clients = dataRows.map((row, index) => {
        const values = row.split("\t").map(value => value.trim());
        const clientData = {};

        headers.forEach((header, i) => {
        clientData[header] = values[i] || '';
        });

        return {
        id: index,
        name: clientData["buyer-name"],
        data: clientData
        };
    });

    return clients;
}
