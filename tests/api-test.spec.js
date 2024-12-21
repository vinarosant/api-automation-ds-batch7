const { test, expect } = require("@playwright/test");
const { Ajv } = require("ajv");

const ajv = new Ajv()

//GET
test("Test Case 1", async ({ request }) => {
    
    const response = await request.get('https://reqres.in/api/users/2');
    expect(response.status()).toBe(200)

    const responseData = await response.json()

    expect(responseData.data.id).toBe(2)
    expect(responseData.data.first_name).toBe("Janet")

    const valid = ajv.validate(require('./jsonschema/get-object-schema1.json'), responseData)

    if (!valid) {
        console.error("AJV Validation Errors:", ajv.errorsText());
    }

    expect(valid).toBe(true);

});

//POST
test("Test Case 2", async ({ request }) => {

    const bodyData = {
        "name": "morpheus",
        "job": "leader"
    };

    const headerData = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    const response = await request.post('https://reqres.in/api/users', {
        headers: headerData,
        data: bodyData
    });

    expect(response.status()).toBe(201); 

    const responseBody = await response.json();
    expect(responseBody.job).toBe("leader"); 
    expect(responseBody.name).toBe("morpheus"); 

    console.log(responseBody); 
});


//DELETE
test("Test Case 3", async ({ request }) => {
    
    const url = 'https://reqres.in/api/users/2'; 
    const response = await request.delete(url);

    expect(response.status()).toBe(204);

    let responseBody = null;
    if (response.status() !== 204) {
        responseBody = await response.json();
        console.log("Response Body:", responseBody);
    } else {
        console.log("No Content, no response body.");
    }

    if (responseBody) {
        const responseSchema = {
            type: "object",
            properties: {
                message: { type: "string" }
            },
            required: ["message"]
        };

        const valid = ajv.validate(responseSchema, responseBody);

        if (!valid) {
            console.error("AJV Validation Errors:", ajv.errorsText());
        }

        expect(valid).toBe(true);
    } else {

        console.log("Skipping JSON Schema validation due to no response body.");
    }
});

//PUT
test("Test Case 4", async ({ request }) => {

    const bodyData = {
            "name": "morpheus",
            "job": "zion resident"
    };

    const headerData = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    const response = await request.put('https://reqres.in/api/users/2', {
        headers: headerData,
        data: bodyData
    });
   
    expect(response.status()).toBe(200); 

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("job"); 
    expect(responseBody.name).toBe("morpheus"); 

    console.log(responseBody); 
});