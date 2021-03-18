'use strict'
process.unhandledRejections = 'strict';
const dialogflow = require('@google-cloud/dialogflow');
const structjson = require('./structjson');
const config = require ('../config/keys');
const mongoose = require('mongoose');
const req = require("express");
const res = require("express");
const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const credentials = {
    client_email: config.googleClientEmail,
    private_key:  config.googlePrivateKey,
};

const sessionClient = new dialogflow.SessionsClient({projectId:projectId, credentials:credentials});
const Registration = mongoose.model('registration');
module.exports = {

    textQuery: async function(text,userID,parameters= {}) {
       //try {
           let self = module.exports;
            const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId + userID);

           // The text query request.
           const request = {
               session: sessionPath,
               queryInput: {
                   text: {
                       // The query to send to the dialogflow agent
                       text: text,
                       // The language used by the client (en-US)
                       languageCode: config.dialogFlowSessionLanguageCode,
                   },
               },
               queryParams: {
                   payload: {
                       data: parameters
                   }
               }
           };
           // Send request and log result
           let responses = await sessionClient.detectIntent(request);
           responses = await self.handleAction(responses);
           return responses;
       //}
       //catch(onrejected) {
       //    console.log('That did not go well.');
       //}
   },
    eventQuery: async function(event,userID,parameters = {}) {
        let self = module.exports;
        let sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId + userID);
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,
                    parameters: structjson.jsonToStructProto(parameters), //Dialogflow's v2 API uses gRPC. You'll need a jsonToStructProto method to convert your JavaScript object to a proto struct.
                    languageCode: config.dialogFlowSessionLanguageCode,
                },
            }
        };

        // Send request and log result
        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);
        return responses;
    },
    handleAction: function(responses){
        let self = module.exports;
        let queryResult = responses[0].queryResult;

        switch (queryResult.action) {
            case 'endconv.endconv-yes':
                if (queryResult.allRequiredParamsPresent) {
                    self.saveRegistration(queryResult.parameters.fields);
                }
                break;
        }

        // console.log(queryResult.action);
        // console.log(queryResult.allRequiredParamsPresent);
        // console.log(queryResult.fulfillmentMessages);
         //console.log(queryResult.parameters.fields);

        return responses;
   },
    saveRegistration: async function(fields){
        const registration = new Registration({
            name: fields.name.stringValue,
            //name: fields.structValue.name.stringValue,
            //props.reply.structValue.fields.payload.stringValue
            //address: fields.address.stringValue,
            phone: fields.phone.stringValue,
            email: fields.email.stringValue,
            dateSent: Date.now()
        });
        try{
            let reg = await registration.save();
            console.log(reg);
        } catch (err){
            console.log(err);
        }
    }
}