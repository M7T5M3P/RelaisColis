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
    // Define the list of required headers (parameters)
    const requiredHeaders = [
        "order_id", "order_item_id", "purchase_date", "payments_date",
        "buyer_email", "buyer_name", "buyer_phone_number", "sku", "product_name",
        "quantity_purchased", "currency", "item_price", "item_tax", "shipping_price",
        "shipping_tax", "ship_service_level", "recipient_name", "ship_address_1",
        "ship_address_2", "ship_address_3", "ship_city", "ship_state", "ship_postal_code",
        "ship_country", "ship_phone_number", "delivery_start_date", "delivery_end_date",
        "delivery_time_zone", "delivery_Instructions", "is_business_order",
        "purchase_order_number", "price_designation", "is_prime", "is_iba"
    ];

    const rows = txtData.split("\n").map(row => row.trim()).filter(row => row.length > 0);
    const headers = rows[0].split("\t").map(header => header.trim());
    const dataRows = rows.slice(1);

    const headerIndices = requiredHeaders.reduce((acc, header) => {
        const index = headers.indexOf(header);
        if (index !== -1) acc[header] = index;
        return acc;
    }, {});

    const clients = dataRows.map((row, index) => {
        const values = row.split("\t").map(value => value.trim());
        const clientData = {};

        Object.entries(headerIndices).forEach(([header, i]) => {
            clientData[header] = values[i] || '';
        });

        return {
            id: index,
            name: clientData["buyer_name"],
            data: clientData
        };
    });

    return clients;
}