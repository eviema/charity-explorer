module.exports = (app) => {
    app.get(
        '/charity-info',
        (req, res) => {
            res.send('This is the page that shows DETAILED info about a charity');
        }
    );
};