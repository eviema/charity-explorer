module.exports = (app) => {
    app.get(
        '/charities-visual',
        (req, res) => {
            res.send('This is the page that shows visualiations and so on...');
        }
    );
};