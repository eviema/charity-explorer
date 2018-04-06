const mongoose = require('mongoose');

const Charity = mongoose.model('charities');
const Cause = mongoose.model('causes');
const Location = mongoose.model('locations');

module.exports = (app) => {
    app.get(
        '/api/charity/:ABN',
        async (req, res) => {
            const charity = await Charity.findOne(
                {ABN: req.params.ABN}
            );
            res.send(charity);
        }
    );

    app.get(
        '/api/charitiesByLoc/:location',
        async (req, res) => {
            var location = req.params.location;
            var locationArray = location.split(" VIC ");
            const charitiesAllMatched = await Charity.find(
                {
                    Town_City: locationArray[0],
                    Postcode: locationArray[1],
                }
            );
            res.send(charitiesAllMatched);
        }
    );

    app.get(
        '/api/causes/:cause',
        async (req, res) => {
            var causeParam = req.params.cause;
            var cause = causeParam.trim();
            const causesMatched = await Cause.find(
                {
                    Main_Activity: cause,
                }
            );
            res.send(causesMatched);
        }
    );

    app.get(
        '/api/charities/:location/:cause',
        async (req, res) => {
            
            var charitiesAllMatched = [];
            var location = req.params.location;
            
            if (location === 'Greater Melbourne') {
                charitiesAllMatched = await Charity.find(
                    {
                        Main_Activity: req.params.cause
                    }
                );
            }
            else {
                var locationArray = location.split(" VIC ");
                charitiesAllMatched = await Charity.find(
                    {
                        Town_City: locationArray[0],
                        Postcode: locationArray[1],
                        Main_Activity: req.params.cause
                    }
                );
            }
                        
            res.send(charitiesAllMatched);
        }
    );

    app.get(
        '/api/causes-all',
        async (req, res) => {
            const causesAll = await Cause.find({});
            res.send(causesAll);
        }
    );

    app.get(
        '/api/locations-all',
        async (req, res) => {
            const locationsAll = await Location.find({});
            res.send(locationsAll);
        }
    );

};