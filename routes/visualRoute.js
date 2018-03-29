module.exports = (app) => {
    app.get(
        '/api/charities-visual',
        (req, res) => {
            res.send('This is the page that shows visualiations and so on...');
        }
    );
};