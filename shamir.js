const fs = require('fs');  // Declare fs only once, at the top

// Read the input from a JSON file
const inputData = JSON.parse(fs.readFileSync('input.json', 'utf8'));

// Function to decode a value from a specific base
function decodeValue(base, value) {
    return parseInt(value, parseInt(base));
}

function main() {
    // Extract keys and their respective values
    const keys = inputData.keys;
    const n = keys.n; // Total number of roots
    const k = keys.k; // Minimum required roots

    console.log(`Number of roots provided (n): ${n}`);
    console.log(`Minimum roots required (k): ${k}`);

    const decodedValues = [];
    
    // Iterate through the keys, starting from 1 up to n
    for (let i = 1; i <= n; i++) {
        const point = inputData[i.toString()]; // Access the point using the string version of the index
        if (point) {
            const base = point.base;
            const value = point.value;

            const decodedY = decodeValue(base, value);
            console.log(`Point ${i}: x = ${i}, y (decoded) = ${decodedY}`);
            decodedValues.push({ x: i, y: decodedY });
        } else {
            console.warn(`Point ${i} is missing in the input data.`);
        }
    }

    // Check if we have enough points to reconstruct the secret
    if (decodedValues.length >= k) {
        const secret = lagrangeInterpolation(decodedValues, k);
        console.log(`The reconstructed secret is: ${secret}`);
    } else {
        console.log("Not enough points to reconstruct the secret.");
    }
}

// Function to perform Lagrange interpolation
function lagrangeInterpolation(points, k) {
    let secret = 0;

    // Loop over each point
    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;

        // Calculate the Lagrange basis polynomial
        let li = 1;
        for (let j = 0; j < k; j++) {
            if (j !== i) {
                li *= (0 - points[j].x) / (xi - points[j].x);
            }
        }
        // Add the contribution of this point to the secret
        secret += li * yi;
    }

    return Math.round(secret); // Return the secret, rounded to the nearest integer
}

// Execute the main function
main();
